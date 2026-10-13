import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../services/storage';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const productRouter = Router();

const productInputSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  sku: z.string().min(2),
  description: z.string().min(5),
  subtitle: z.string().optional(),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  image: z.string().url(),
  additionalImages: z.array(z.string().url()).optional(),
  category: z.string().min(2),
  recipient: z.array(z.string()).optional(),
  occasion: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional(),
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().default(5),
  isPersonalizable: z.boolean().default(true),
  giftWrappingAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
});

// GET /api/products
productRouter.get('/', (req: Request, res: Response) => {
  let products = storage.getProducts();

  // Allow admin to request draft/archived, public only gets active
  const includeAllStatus = req.query.includeAll === 'true';
  if (!includeAllStatus) {
    products = products.filter((p) => p.status === 'active');
  }

  // Filter by category
  if (req.query.category && req.query.category !== 'all') {
    const cat = String(req.query.category).toLowerCase();
    products = products.filter(
      (p) =>
        p.category.toLowerCase() === cat ||
        p.occasion.some((o) => o.toLowerCase() === cat)
    );
  }

  // Filter by occasion
  if (req.query.occasion && req.query.occasion !== 'all') {
    const occ = String(req.query.occasion).toLowerCase();
    products = products.filter((p) =>
      p.occasion.some((o) => o.toLowerCase() === occ)
    );
  }

  // Filter by recipient
  if (req.query.recipient && req.query.recipient !== 'all') {
    const rec = String(req.query.recipient).toLowerCase();
    products = products.filter(
      (p) => p.recipient && p.recipient.some((r) => r.toLowerCase() === rec)
    );
  }

  // Filter by search query
  if (req.query.search) {
    const q = String(req.query.search).toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  // Filter by max price
  if (req.query.maxPrice) {
    const max = Number(req.query.maxPrice);
    if (!isNaN(max)) {
      products = products.filter((p) => p.price <= max);
    }
  }

  // Sort
  if (req.query.sort) {
    const sort = String(req.query.sort);
    if (sort === 'price_asc') products.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
    if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
    if (sort === 'newest')
      products.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  res.json({
    total: products.length,
    products,
  });
});

// GET /api/products/:id
productRouter.get('/:id', (req: Request, res: Response) => {
  const product = storage.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// POST /api/admin/products
productRouter.post('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = productInputSchema.parse(req.body);
    const slug =
      data.slug ||
      data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existingSku = storage.getProducts().find((p) => p.sku === data.sku);
    if (existingSku) {
      return res.status(400).json({ error: `SKU ${data.sku} is already in use.` });
    }

    const created = storage.createProduct({
      ...data,
      slug,
      rating: 5.0,
      reviewCount: 0,
    });

    storage.addAuditLog({
      adminId: req.user!.userId,
      adminEmail: req.user!.email,
      action: 'product_create',
      resource: 'product',
      resourceId: created.id,
      details: { name: created.name, price: created.price, sku: created.sku },
      ipAddress: req.ip,
    });

    res.status(201).json({ message: 'Product created successfully', product: created });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PATCH /api/admin/products/:id
productRouter.patch('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = storage.getProductById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updated = storage.updateProduct(existing.id, req.body);

    storage.addAuditLog({
      adminId: req.user!.userId,
      adminEmail: req.user!.email,
      action: 'product_update',
      resource: 'product',
      resourceId: existing.id,
      details: req.body,
      ipAddress: req.ip,
    });

    res.json({ message: 'Product updated successfully', product: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id
productRouter.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = storage.getProductById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Prefer soft delete / archiving to protect historical orders
  storage.deleteProduct(existing.id, true);

  storage.addAuditLog({
    adminId: req.user!.userId,
    adminEmail: req.user!.email,
    action: 'product_archive',
    resource: 'product',
    resourceId: existing.id,
    details: { name: existing.name },
    ipAddress: req.ip,
  });

  res.json({ message: 'Product archived successfully' });
});
