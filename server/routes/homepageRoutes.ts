import { Router, Request, Response } from 'express';
import { storage } from '../services/storage';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const homepageRouter = Router();

// GET /api/storefront/homepage
homepageRouter.get('/', (req: Request, res: Response) => {
  const content = storage.getHomepageContent();
  res.json({ content });
});

// PATCH /api/admin/storefront/homepage
homepageRouter.patch('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = storage.updateHomepageContent(req.body);

  storage.addAuditLog({
    adminId: req.user!.userId,
    adminEmail: req.user!.email,
    action: 'homepage_content_update',
    resource: 'storefront_homepage',
    details: req.body,
    ipAddress: req.ip,
  });

  res.json({ message: 'Homepage content updated successfully', content: updated });
});
