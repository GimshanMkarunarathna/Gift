import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../services/storage';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { OrderFulfillmentStatus, OrderPaymentStatus } from '../models/types';

export const orderRouter = Router();

const checkoutItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  personalization: z
    .object({
      recipientName: z.string().optional(),
      message: z.string().optional(),
      waxSealColor: z.string().optional(),
      fontStyle: z.string().optional(),
    })
    .optional(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7),
  deliveryAddress: z.object({
    recipientName: z.string().min(2),
    street: z.string().min(3),
    district: z.string().min(2),
    notes: z.string().optional(),
  }),
  items: z.array(checkoutItemSchema).min(1),
  includeGiftWrap: z.boolean().default(true),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['card', 'koko', 'mintpay', 'cod']).default('card'),
});

// POST /api/orders — Customer Checkout
orderRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = createOrderSchema.parse(req.body);

    // 1. Recalculate prices and verify stock on the server using authoritative product records
    const verifiedItems = [];
    let subtotal = 0;

    for (const item of data.items) {
      const product = storage.getProductById(item.productId);
      if (!product || product.status !== 'active') {
        return res.status(400).json({
          error: `Product "${item.productId}" is currently unavailable or inactive.`,
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${product.name}". Only ${product.stockQuantity} remaining.`,
        });
      }

      const unitPrice = product.price;
      subtotal += unitPrice * item.quantity;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        unitPrice,
        quantity: item.quantity,
        image: product.image,
        personalization: item.personalization,
      });
    }

    // 2. Validate coupon if provided
    let discount = 0;
    let appliedCouponCode: string | undefined = undefined;

    if (data.couponCode && data.couponCode.trim()) {
      const coupon = storage.getCouponByCode(data.couponCode.trim());
      if (coupon) {
        if (subtotal >= coupon.minOrderAmount) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round((subtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.discountValue;
          }
          appliedCouponCode = coupon.code;
          storage.incrementCouponUsage(coupon.id);
        }
      }
    }

    // 3. Calculate gift wrapping & delivery charges
    const isFreeGiftWrap = subtotal >= 5000;
    const giftWrapPrice = data.includeGiftWrap && !isFreeGiftWrap ? 450 : 0;
    const isFreeDelivery = subtotal >= 10000;
    const deliveryFee = isFreeDelivery ? 0 : 450;

    const total = Math.max(0, subtotal - discount + giftWrapPrice + deliveryFee);

    // 4. Determine initial payment status (sandbox simulation if card, pending if COD)
    const paymentStatus: OrderPaymentStatus =
      data.paymentMethod === 'cod' ? 'pending' : 'paid';

    // 5. Create persistent order and decrement inventory atomically
    const order = storage.createOrder({
      customerId: req.user?.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      items: verifiedItems,
      giftWrap: {
        selected: data.includeGiftWrap,
        price: giftWrapPrice,
      },
      subtotal,
      discount,
      couponCode: appliedCouponCode,
      deliveryFee,
      total,
      paymentMethod: data.paymentMethod,
      paymentStatus,
      fulfillmentStatus: 'confirmed',
    });

    res.status(201).json({
      message: 'Order placed successfully! Our artisans have begun packaging your keepsake.',
      order,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues.map((e) => e.message).join(', ') });
    }
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to process order. Please try again.' });
  }
});

// GET /api/orders/track/:orderNumber — Public order tracking
orderRouter.get('/track/:orderNumber', (req: Request, res: Response) => {
  const orderNumber = req.params.orderNumber.toUpperCase().trim();
  const order = storage.getOrderById(orderNumber);

  if (!order) {
    return res.status(404).json({ error: `Order ${orderNumber} not found.` });
  }

  // Return public tracking snapshot (hide internal payment credentials)
  res.json({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    district: order.deliveryAddress.district,
    fulfillmentStatus: order.fulfillmentStatus,
    paymentStatus: order.paymentStatus,
    trackingNumber: order.trackingNumber,
    items: order.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      image: i.image,
      personalization: i.personalization,
    })),
    statusHistory: order.statusHistory,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  });
});

// GET /api/orders — Customer's orders
orderRouter.get('/', (req: AuthenticatedRequest, res: Response) => {
  let orders = storage.getOrders();
  if (req.user) {
    orders = orders.filter(
      (o) =>
        o.customerId === req.user!.userId ||
        o.customerEmail.toLowerCase() === req.user!.email.toLowerCase()
    );
  } else if (req.query.email) {
    const email = String(req.query.email).toLowerCase();
    orders = orders.filter((o) => o.customerEmail.toLowerCase() === email);
  } else {
    return res.json({ orders: [] });
  }
  res.json({ orders });
});

// GET /api/admin/orders — Admin Order Listing
orderRouter.get('/admin/all', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  let orders = storage.getOrders();

  // Search by orderNumber or customer
  if (req.query.search) {
    const q = String(req.query.search).toLowerCase();
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
    );
  }

  // Filter by fulfillment status
  if (req.query.status && req.query.status !== 'all') {
    orders = orders.filter((o) => o.fulfillmentStatus === req.query.status);
  }

  // Filter by payment status
  if (req.query.paymentStatus && req.query.paymentStatus !== 'all') {
    orders = orders.filter((o) => o.paymentStatus === req.query.paymentStatus);
  }

  res.json({
    total: orders.length,
    orders,
  });
});

// PATCH /api/admin/orders/:id/status — Update fulfillment status
orderRouter.patch('/admin/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status, note } = req.body;
  const validStatuses: OrderFulfillmentStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'packed',
    'shipped',
    'delivered',
    'cancelled',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid fulfillment status.' });
  }

  const updated = storage.updateOrderStatus(
    req.params.id,
    status,
    note,
    req.user?.name || req.user?.email
  );

  if (!updated) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  storage.addAuditLog({
    adminId: req.user!.userId,
    adminEmail: req.user!.email,
    action: 'order_status_update',
    resource: 'order',
    resourceId: updated.orderNumber,
    details: { newStatus: status, note },
    ipAddress: req.ip,
  });

  res.json({ message: 'Order status updated', order: updated });
});

// PATCH /api/admin/orders/:id/tracking — Update tracking number
orderRouter.patch('/admin/:id/tracking', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { trackingNumber } = req.body;
  if (!trackingNumber) {
    return res.status(400).json({ error: 'Tracking number is required.' });
  }

  const updated = storage.updateOrderTracking(req.params.id, trackingNumber);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  storage.addAuditLog({
    adminId: req.user!.userId,
    adminEmail: req.user!.email,
    action: 'order_tracking_assigned',
    resource: 'order',
    resourceId: updated.orderNumber,
    details: { trackingNumber },
    ipAddress: req.ip,
  });

  res.json({ message: 'Tracking updated', order: updated });
});
