import { Router, Response } from 'express';
import { z } from 'zod';
import { storage } from '../services/storage';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const inventoryRouter = Router();

const adjustStockSchema = z.object({
  changeQuantity: z.number().int(),
  reason: z.enum(['order_placed', 'order_cancelled', 'restock', 'manual_adjustment', 'damage']),
  note: z.string().optional(),
});

// GET /api/admin/inventory
inventoryRouter.get('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const products = storage.getProducts();

  const inventoryList = products.map((p) => ({
    productId: p.id,
    name: p.name,
    sku: p.sku,
    category: p.category,
    image: p.image,
    price: p.price,
    stockQuantity: p.stockQuantity,
    lowStockThreshold: p.lowStockThreshold,
    isLowStock: p.stockQuantity <= p.lowStockThreshold,
    isOutOfStock: p.stockQuantity === 0,
    status: p.status,
  }));

  const movements = storage.getInventoryMovements().slice(0, 50);

  res.json({
    totalItems: inventoryList.length,
    lowStockCount: inventoryList.filter((i) => i.isLowStock).length,
    outOfStockCount: inventoryList.filter((i) => i.isOutOfStock).length,
    inventory: inventoryList,
    recentMovements: movements,
  });
});

// PATCH /api/admin/inventory/:id
inventoryRouter.patch('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { changeQuantity, reason, note } = adjustStockSchema.parse(req.body);
    const product = storage.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const previousQuantity = product.stockQuantity;
    const newQuantity = Math.max(0, previousQuantity + changeQuantity);

    storage.updateProduct(product.id, { stockQuantity: newQuantity });

    const movement = storage.recordInventoryMovement({
      productId: product.id,
      productName: product.name,
      changeQuantity,
      previousQuantity,
      newQuantity,
      reason,
      referenceId: note || `Admin adjusted by ${req.user!.email}`,
    });

    storage.addAuditLog({
      adminId: req.user!.userId,
      adminEmail: req.user!.email,
      action: 'inventory_adjust',
      resource: 'inventory',
      resourceId: product.id,
      details: {
        product: product.name,
        previousQuantity,
        changeQuantity,
        newQuantity,
        reason,
        note,
      },
      ipAddress: req.ip,
    });

    res.json({
      message: 'Inventory updated successfully',
      product: { ...product, stockQuantity: newQuantity },
      movement,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Failed to adjust inventory.' });
  }
});
