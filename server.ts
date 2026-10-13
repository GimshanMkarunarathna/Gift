import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { authenticate } from './server/middleware/auth';
import { authRouter } from './server/routes/authRoutes';
import { productRouter } from './server/routes/productRoutes';
import { categoryRouter } from './server/routes/categoryRoutes';
import { orderRouter } from './server/routes/orderRoutes';
import { inventoryRouter } from './server/routes/inventoryRoutes';
import { customerRouter } from './server/routes/customerRoutes';
import { couponRouter } from './server/routes/couponRoutes';
import { dashboardRouter } from './server/routes/dashboardRoutes';
import { homepageRouter } from './server/routes/homepageRoutes';
import { auditRouter } from './server/routes/auditRoutes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();

  // Basic security and parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Global auth parser
  app.use(authenticate);

  // Mount API routes
  app.use('/api/auth', authRouter);
  app.use('/api/products', productRouter);
  app.use('/api/admin/products', productRouter);
  app.use('/api', categoryRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/admin/inventory', inventoryRouter);
  app.use('/api/admin/customers', customerRouter);
  app.use('/api/coupons', couponRouter);
  app.use('/api/admin/dashboard', dashboardRouter);
  app.use('/api/storefront/homepage', homepageRouter);
  app.use('/api/admin/storefront/homepage', homepageRouter);
  app.use('/api/admin/audit-logs', auditRouter);

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Giftora Luxury Gifting API',
      time: new Date().toISOString(),
    });
  });

  if (!isProd) {
    // Mount Vite middlewares in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ GIFTORA Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
