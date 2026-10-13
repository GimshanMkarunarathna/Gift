import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { storage } from '../services/storage';
import { generateToken } from '../config/jwt';
import { AuthenticatedRequest } from '../middleware/auth';
import { loginRateLimiter } from '../middleware/rateLimiter';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
});

authRouter.post('/login', loginRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = storage.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'This account has been suspended. Please contact concierge.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    storage.updateUser(user.id, { lastLoginAt: new Date().toISOString() });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.cookie('giftora_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (user.role === 'admin') {
      storage.addAuditLog({
        adminId: user.id,
        adminEmail: user.email,
        action: 'admin_login_success',
        resource: 'auth',
        ipAddress: req.ip,
      });
    }

    const { passwordHash: _, ...safeUser } = user;
    res.json({
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Server error during login' });
  }
});

authRouter.post('/register', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = storage.getUserByEmail(data.email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = bcrypt.hashSync(data.password, 10);
    const newUser = storage.createUser({
      email: data.email,
      passwordHash,
      name: data.name,
      role: 'customer',
      phone: data.phone,
      address: data.address,
      status: 'active',
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    res.cookie('giftora_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues.map((e) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

authRouter.post('/logout', (req: AuthenticatedRequest, res: Response) => {
  res.clearCookie('giftora_token');
  res.json({ message: 'Logged out successfully' });
});

authRouter.get('/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  const user = storage.getUserById(req.user.userId);
  if (!user) {
    return res.json({ user: null });
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});
