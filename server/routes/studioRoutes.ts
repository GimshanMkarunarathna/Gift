import { Router, Response } from 'express';
import { storage } from '../services/storage';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const studioRouter = Router();
export const customRequestRouter = Router();
export const brandSettingsRouter = Router();

// ==========================================
// 1. GIFTY ASSETS API
// ==========================================

// Public & Admin: Get Assets
studioRouter.get('/assets', (req: AuthenticatedRequest, res: Response) => {
  const status = req.query.status as string | undefined;
  const assets = storage.getGifyAssets(status);
  res.json({ total: assets.length, assets });
});

// Admin: Create Asset
studioRouter.post('/assets', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { title, name, animationPreset, category, previewEmoji, svgIcon, tag, color, status } = req.body;
  if (!name && !title) {
    return res.status(400).json({ error: 'Asset title is required' });
  }

  const asset = storage.createGifyAsset({
    title: title || name,
    name: name || title,
    animationPreset: animationPreset || 'bloom',
    category: category || 'Botanical',
    previewEmoji: previewEmoji || '✨',
    svgIcon: svgIcon || 'auto_awesome',
    tag: tag || 'Cute',
    color: color || '#4CAF50',
    status: status || 'active',
  });

  storage.addAuditLog({
    adminId: req.user?.userId || 'admin',
    adminEmail: req.user?.email || 'admin@gluckgify.com',
    action: 'create_gify_asset',
    resource: 'gify_assets',
    resourceId: asset.id,
    details: { title: asset.title, category: asset.category },
  });

  res.status(201).json({ message: 'Gify asset created successfully', asset });
});

// Admin: Update Asset
studioRouter.patch('/assets/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = storage.updateGifyAsset(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  storage.addAuditLog({
    adminId: req.user?.userId || 'admin',
    adminEmail: req.user?.email || 'admin@gluckgify.com',
    action: 'update_gify_asset',
    resource: 'gify_assets',
    resourceId: id,
    details: req.body,
  });

  res.json({ message: 'Gify asset updated successfully', asset: updated });
});

// Admin: Delete Asset
studioRouter.delete('/assets/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = storage.deleteGifyAsset(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  storage.addAuditLog({
    adminId: req.user?.userId || 'admin',
    adminEmail: req.user?.email || 'admin@gluckgify.com',
    action: 'delete_gify_asset',
    resource: 'gify_assets',
    resourceId: id,
  });

  res.json({ message: 'Gify asset removed successfully' });
});

// ==========================================
// 2. CUTE ACCESSORIES API
// ==========================================

// Public & Admin: Get Accessories
studioRouter.get('/accessories', (req: AuthenticatedRequest, res: Response) => {
  const status = req.query.status as string | undefined;
  const accessories = storage.getCuteAccessories(status);
  res.json({ total: accessories.length, accessories });
});

// Admin: Create Accessory
studioRouter.post('/accessories', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { title, name, sku, price, stock, imageUrl, description, category, badge, status } = req.body;
  if (!title && !name) {
    return res.status(400).json({ error: 'Accessory title is required' });
  }

  const accessory = storage.createCuteAccessory({
    title: title || name,
    name: name || title,
    sku: sku || `GK-ACC-${Date.now().toString().slice(-4)}`,
    price: Number(price) || 1500,
    stock: Number(stock) || 10,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1611591475878-83141dfd16a5?auto=format&fit=crop&w=500&q=80',
    description: description || 'Handcrafted botanical accessory from the GLÜCK GIFY studio.',
    category: category || 'Stationery',
    badge: badge || undefined,
    status: status || 'active',
  });

  storage.addAuditLog({
    adminId: req.user?.userId || 'admin',
    adminEmail: req.user?.email || 'admin@gluckgify.com',
    action: 'create_cute_accessory',
    resource: 'cute_accessories',
    resourceId: accessory.id,
    details: { title: accessory.title, price: accessory.price },
  });

  res.status(201).json({ message: 'Cute accessory created successfully', accessory });
});

// Admin: Update Accessory
studioRouter.patch('/accessories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = storage.updateCuteAccessory(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Accessory not found' });
  }

  storage.addAuditLog({
    adminId: req.user?.userId || 'admin',
    adminEmail: req.user?.email || 'admin@gluckgify.com',
    action: 'update_cute_accessory',
    resource: 'cute_accessories',
    resourceId: id,
    details: req.body,
  });

  res.json({ message: 'Cute accessory updated successfully', accessory: updated });
});

// Admin: Delete Accessory
studioRouter.delete('/accessories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = storage.deleteCuteAccessory(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Accessory not found' });
  }

  storage.addAuditLog({
    adminId: req.user?.userId || 'admin',
    adminEmail: req.user?.email || 'admin@gluckgify.com',
    action: 'delete_cute_accessory',
    resource: 'cute_accessories',
    resourceId: id,
  });

  res.json({ message: 'Accessory removed successfully' });
});

// ==========================================
// 3. ORDER & CUSTOM MAKER REQUESTS API
// ==========================================

// Public: Create customer custom request
customRequestRouter.post('/', (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    customerName,
    customerEmail,
    motif,
    caption,
    colorTheme,
    animationSpeed,
    stickers,
    requestType,
    amount,
  } = req.body;

  const newReq = storage.createCustomRequest({
    title: title || 'Custom Blossom Gify Project',
    customerName: customerName || (req.user ? req.user.name : 'Studio Guest'),
    customerEmail: customerEmail || (req.user ? req.user.email : undefined),
    motif: motif || 'lily',
    caption: caption || 'May your day bloom with beauty ✨',
    colorTheme: colorTheme || 'lily-green',
    animationSpeed: animationSpeed || 'gentle',
    stickers: Array.isArray(stickers) ? stickers : ['sparkles'],
    requestType: requestType || 'custom_gify',
    status: 'pending',
    amount: amount || 2500,
  });

  res.status(201).json({ message: 'Custom creation submitted successfully', request: newReq });
});

// Admin: Get all custom requests
customRequestRouter.get('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const status = req.query.status as string | undefined;
  const requests = storage.getCustomRequests(status);
  res.json({ total: requests.length, requests });
});

// Admin: Update Status ('pending' | 'processing' | 'completed' | 'shipped')
customRequestRouter.patch('/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'processing', 'completed', 'shipped'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be pending, processing, completed, or shipped' });
  }

  const updated = storage.updateCustomRequestStatus(id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Request not found' });
  }

  storage.addAuditLog({
    adminId: req.user?.userId || 'admin',
    adminEmail: req.user?.email || 'admin@gluckgify.com',
    action: 'update_custom_request_status',
    resource: 'custom_requests',
    resourceId: id,
    details: { newStatus: status },
  });

  res.json({ message: `Custom request status updated to ${status}`, request: updated });
});

// Admin: Delete custom request
customRequestRouter.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = storage.deleteCustomRequest(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.json({ message: 'Custom request removed' });
});

// ==========================================
// 4. BRAND SETTINGS & THEME CONFIGURATION API
// ==========================================

// Public: Get brand settings
brandSettingsRouter.get('/', (req: AuthenticatedRequest, res: Response) => {
  const settings = storage.getBrandSettings();
  res.json({ settings });
});

// Admin: Update brand settings
brandSettingsRouter.patch('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = storage.updateBrandSettings(req.body);

  storage.addAuditLog({
    adminId: req.user?.userId || 'admin',
    adminEmail: req.user?.email || 'admin@gluckgify.com',
    action: 'update_brand_settings',
    resource: 'brand_settings',
    details: req.body,
  });

  res.json({ message: 'Brand settings and theme configuration saved', settings: updated });
});
