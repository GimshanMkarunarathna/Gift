import { Router, Response } from 'express';
import { storage } from '../services/storage';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const auditRouter = Router();

// GET /api/admin/audit-logs
auditRouter.get('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const logs = storage.getAuditLogs().slice(0, 100);
  res.json({ logs });
});
