import { Router, Response } from 'express';
import { storage } from '../services/storage';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const customerRouter = Router();

// GET /api/admin/customers
customerRouter.get('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const users = storage.getUsers();
  const orders = storage.getOrders();

  let customers = users.map((u) => {
    const userOrders = orders.filter(
      (o) => o.customerId === u.id || o.customerEmail.toLowerCase() === u.email.toLowerCase()
    );
    const totalSpent = userOrders.reduce((sum, o) => (o.paymentStatus === 'paid' ? sum + o.total : sum), 0);

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      address: u.address,
      status: u.status,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
      orderCount: userOrders.length,
      totalSpent,
    };
  });

  if (req.query.search) {
    const q = String(req.query.search).toLowerCase();
    customers = customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }

  res.json({ total: customers.length, customers });
});

// GET /api/admin/customers/:id
customerRouter.get('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const user = storage.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Customer not found.' });
  }

  const orders = storage
    .getOrders()
    .filter(
      (o) => o.customerId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase()
    );

  const totalSpent = orders.reduce(
    (sum, o) => (o.paymentStatus === 'paid' ? sum + o.total : sum),
    0
  );

  const { passwordHash: _, ...safeUser } = user;
  res.json({
    customer: {
      ...safeUser,
      orderCount: orders.length,
      totalSpent,
      orders,
    },
  });
});

// PATCH /api/admin/customers/:id/status
customerRouter.patch('/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Invalid customer status.' });
  }

  const updated = storage.updateUser(req.params.id, { status });
  if (!updated) {
    return res.status(404).json({ error: 'Customer not found.' });
  }

  storage.addAuditLog({
    adminId: req.user!.userId,
    adminEmail: req.user!.email,
    action: 'customer_status_change',
    resource: 'customer',
    resourceId: updated.id,
    details: { newStatus: status },
    ipAddress: req.ip,
  });

  const { passwordHash: _, ...safeUser } = updated;
  res.json({ message: 'Customer status updated', customer: safeUser });
});
