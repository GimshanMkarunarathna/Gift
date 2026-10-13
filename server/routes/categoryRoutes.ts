import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../services/storage';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const categoryRouter = Router();

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().url(),
  imageAlt: z.string().optional(),
  badge: z.string().optional(),
  badgeType: z.enum(['primary', 'secondary', 'tertiary']).optional(),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

const occasionSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  tagline: z.string().min(2),
  description: z.string().min(5),
  image: z.string().url(),
  imageAlt: z.string().optional(),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

// Categories
categoryRouter.get('/categories', (req: Request, res: Response) => {
  const includeAll = req.query.includeAll === 'true';
  let categories = storage.getCategories();
  if (!includeAll) {
    categories = categories.filter((c) => c.isActive);
  }
  categories.sort((a, b) => a.displayOrder - b.displayOrder);
  res.json({ categories });
});

categoryRouter.post('/admin/categories', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = categorySchema.parse(req.body);
    const created = storage.createCategory(data);
    storage.addAuditLog({
      adminId: req.user!.userId,
      adminEmail: req.user!.email,
      action: 'category_create',
      resource: 'category',
      resourceId: created.id,
      details: { name: created.name },
      ipAddress: req.ip,
    });
    res.status(201).json({ message: 'Category created', category: created });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
});

categoryRouter.patch('/admin/categories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = storage.updateCategory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Category not found' });
  }
  storage.addAuditLog({
    adminId: req.user!.userId,
    adminEmail: req.user!.email,
    action: 'category_update',
    resource: 'category',
    resourceId: updated.id,
    details: req.body,
    ipAddress: req.ip,
  });
  res.json({ message: 'Category updated', category: updated });
});

categoryRouter.delete('/admin/categories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const success = storage.deleteCategory(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Category not found' });
  }
  storage.addAuditLog({
    adminId: req.user!.userId,
    adminEmail: req.user!.email,
    action: 'category_delete',
    resource: 'category',
    resourceId: req.params.id,
    ipAddress: req.ip,
  });
  res.json({ message: 'Category deleted' });
});

// Occasions
categoryRouter.get('/occasions', (req: Request, res: Response) => {
  const includeAll = req.query.includeAll === 'true';
  let occasions = storage.getOccasions();
  if (!includeAll) {
    occasions = occasions.filter((o) => o.isActive);
  }
  occasions.sort((a, b) => a.displayOrder - b.displayOrder);
  res.json({ occasions });
});

categoryRouter.post('/admin/occasions', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = occasionSchema.parse(req.body);
    const created = storage.createOccasion(data);
    storage.addAuditLog({
      adminId: req.user!.userId,
      adminEmail: req.user!.email,
      action: 'occasion_create',
      resource: 'occasion',
      resourceId: created.id,
      details: { title: created.title },
      ipAddress: req.ip,
    });
    res.status(201).json({ message: 'Occasion created', occasion: created });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Failed to create occasion' });
  }
});

categoryRouter.patch('/admin/occasions/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = storage.updateOccasion(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Occasion not found' });
  }
  storage.addAuditLog({
    adminId: req.user!.userId,
    adminEmail: req.user!.email,
    action: 'occasion_update',
    resource: 'occasion',
    resourceId: updated.id,
    details: req.body,
    ipAddress: req.ip,
  });
  res.json({ message: 'Occasion updated', occasion: updated });
});
