import jwt from 'jsonwebtoken';
import { UserRole } from '../models/types';

const JWT_SECRET = process.env.JWT_SECRET || 'giftora-luxury-secret-key-change-in-production-2027';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
