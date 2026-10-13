export type UserRole = 'admin' | 'staff' | 'customer';

export interface UserDocument {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}

export interface ProductDocument {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  subtitle?: string;
  price: number; // LKR
  salePrice?: number;
  image: string; // Primary image URL
  additionalImages?: string[];
  category: string;
  recipient?: string[];
  occasion: string[];
  tags?: string[];
  stockQuantity: number;
  lowStockThreshold: number;
  isPersonalizable: boolean;
  personalizationOptions?: {
    calligraphyNote?: boolean;
    waxSealStamp?: boolean;
    laserEngraving?: boolean;
  };
  giftWrappingAvailable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDocument {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  imageAlt?: string;
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'tertiary' | 'accent';
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface OccasionDocument {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt?: string;
  displayOrder: number;
  isActive: boolean;
}

export type OrderPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderFulfillmentStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
  image: string;
  personalization?: {
    recipientName?: string;
    message?: string;
    waxSealColor?: string;
    fontStyle?: string;
  };
}

export interface OrderStatusHistoryItem {
  status: OrderFulfillmentStatus;
  note: string;
  timestamp: string;
  updatedBy?: string;
}

export interface OrderDocument {
  id: string;
  orderNumber: string; // e.g. GF-88421
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: {
    recipientName: string;
    street: string;
    district: string;
    notes?: string;
  };
  items: OrderItemSnapshot[];
  giftWrap: {
    selected: boolean;
    price: number;
  };
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  paymentMethod: 'card' | 'koko' | 'mintpay' | 'cod';
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  trackingNumber?: string;
  statusHistory: OrderStatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CouponDocument {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  startDate?: string;
  expiryDate?: string;
  usageLimit: number;
  usageCount: number;
  perCustomerLimit: number;
  isActive: boolean;
  createdAt: string;
}

export interface InventoryMovementDocument {
  id: string;
  productId: string;
  productName: string;
  changeQuantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: 'order_placed' | 'order_cancelled' | 'restock' | 'manual_adjustment' | 'damage';
  referenceId?: string; // orderId or user note
  createdAt: string;
}

export interface HomepageContentDocument {
  announcementText: string;
  promoCode: string;
  promoDiscountPercent: number;
  heroEyebrow: string;
  heroHeadline: string;
  heroItalicWord: string;
  heroDescription: string;
  heroImage: string;
  complimentaryDetailNote: string;
  journalTitle: string;
  journalSubtitle: string;
  updatedAt: string;
}

export interface AuditLogDocument {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}
