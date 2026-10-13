import { Router, Response } from 'express';
import { storage } from '../services/storage';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const dashboardRouter = Router();

// GET /api/admin/dashboard/summary
dashboardRouter.get('/summary', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const orders = storage.getOrders();
  const products = storage.getProducts();
  const users = storage.getUsers();

  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.fulfillmentStatus === 'pending' || o.fulfillmentStatus === 'confirmed');
  const activeProducts = products.filter((p) => p.status === 'active');
  const lowStockProducts = products.filter((p) => p.stockQuantity <= p.lowStockThreshold && p.status === 'active');
  const registeredCustomers = users.filter((u) => u.role === 'customer');

  res.json({
    totalRevenue,
    totalOrders: orders.length,
    pendingOrdersCount: pendingOrders.length,
    activeProductsCount: activeProducts.length,
    lowStockCount: lowStockProducts.length,
    registeredCustomersCount: registeredCustomers.length,
  });
});

// GET /api/admin/dashboard/sales
dashboardRouter.get('/sales', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const orders = storage.getOrders();
  // Aggregate sales over the last 7 days
  const now = new Date();
  const days: { date: string; label: string; revenue: number; ordersCount: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const dayOrders = orders.filter((o) => o.createdAt.startsWith(dateStr));
    const dayRevenue = dayOrders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    days.push({
      date: dateStr,
      label: dayLabel,
      revenue: dayRevenue,
      ordersCount: dayOrders.length,
    });
  }

  res.json({ salesTimeline: days });
});

// GET /api/admin/dashboard/top-products
dashboardRouter.get('/top-products', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const orders = storage.getOrders();
  const productCountMap = new Map<string, { name: string; image: string; count: number; revenue: number }>();

  for (const order of orders) {
    for (const item of order.items) {
      const existing = productCountMap.get(item.productId);
      if (existing) {
        existing.count += item.quantity;
        existing.revenue += item.unitPrice * item.quantity;
      } else {
        productCountMap.set(item.productId, {
          name: item.name,
          image: item.image,
          count: item.quantity,
          revenue: item.unitPrice * item.quantity,
        });
      }
    }
  }

  const topProducts = Array.from(productCountMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  res.json({ topProducts });
});

// GET /api/admin/dashboard/recent-orders
dashboardRouter.get('/recent-orders', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const orders = storage.getOrders().slice(0, 8);
  res.json({ recentOrders: orders });
});
