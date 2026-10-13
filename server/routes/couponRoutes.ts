import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../services/storage';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const couponRouter = Router();

const couponSchema = z.object({
  code: z.string().min(2),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscount: z.number().positive().optional(),
  startDate: z.string().optional(),
  expiryDate: z.string().optional(),
  usageLimit: z.number().int().positive().default(100),
  perCustomerLimit: z.number().int().positive().default(1),
  isActive: z.boolean().default(true),
});

// GET /api/coupons/validate — Public checkout validation
couponRouter.get('/validate', (req: Request, res: Response) => {
  const code = req.query.code ? String(req.query.code).trim().toUpperCase() : '';
  const subtotal = req.query.subtotal ? Number(req.query.subtotal) : 0;

  if (!code) {
    return res.status(400).json({ valid: false, error: 'Coupon code required' });
  }

  const coupon = storage.getCouponByCode(code);
  if (!coupon) {
    return res.status(400).json({ valid: false, error: 'Invalid or expired coupon code' });
  }

  if (coupon.usageCount >= coupon.usageLimit) {
    return res.status(400).json({ valid: false, error: 'Coupon usage limit has been reached' });
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return res.status(400).json({
      valid: false,
      error: `Minimum order amount of LKR ${coupon.minOrderAmount.toLocaleString()} required for this coupon`,
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  res.json({
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    calculatedDiscount: discountAmount,
  });
});

// GET /api/admin/coupons
couponRouter.get('/admin', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const coupons = storage.getCoupons();
  res.json({ coupons });
});

// POST /api/admin/coupons
couponRouter.post('/admin', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = couponSchema.parse(req.body);
    const existing = storage.getCouponByCode(data.code);
    if (existing) {
      return res.status(400).json({ error: 'A coupon with this code already exists.' });
    }

    const created = storage.createCoupon(data);
    storage.addAuditLog({
      adminId: req.user!.userId,
      adminEmail: req.user!.email,
      action: 'coupon_create',
      resource: 'coupon',
      resourceId: created.id,
      details: { code: created.code, discount: created.discountValue },
      ipAddress: req.ip,
    });
    res.status(201).json({ message: 'Coupon created', coupon: created });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

// PATCH /api/admin/coupons/:id
couponRouter.patch('/admin/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = storage.updateCoupon(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Coupon not found.' });
  }
  storage.addAuditLog({
    adminId: req.user!.userId,
    adminEmail: req.user!.email,
    action: 'coupon_update',
    resource: 'coupon',
    resourceId: updated.id,
    details: req.body,
    ipAddress: req.ip,
  });
  res.json({ message: 'Coupon updated', coupon: updated });
});

// DELETE /api/admin/coupons/:id
couponRouter.delete('/admin/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const success = storage.deleteCoupon(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Coupon not found.' });
  }
  storage.addAuditLog({
    adminId: req.user!.userId,
    adminEmail: req.user!.email,
    action: 'coupon_delete',
    resource: 'coupon',
    resourceId: req.params.id,
    ipAddress: req.ip,
  });
  res.json({ message: 'Coupon deleted' });
});
