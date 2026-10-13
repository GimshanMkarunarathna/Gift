import mongoose, { Schema } from 'mongoose';

// User Schema
export const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff', 'customer'], default: 'customer' },
    phone: { type: String },
    address: { type: String },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Product Schema
export const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    subtitle: { type: String },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    image: { type: String, required: true },
    additionalImages: [{ type: String }],
    category: { type: String, required: true },
    recipient: [{ type: String }],
    occasion: [{ type: String }],
    tags: [{ type: String }],
    stockQuantity: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    isPersonalizable: { type: Boolean, default: false },
    personalizationOptions: {
      calligraphyNote: { type: Boolean, default: true },
      waxSealStamp: { type: Boolean, default: true },
      laserEngraving: { type: Boolean, default: false },
    },
    giftWrappingAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

// Category Schema
export const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String, required: true },
    imageAlt: { type: String },
    badge: { type: String },
    badgeType: { type: String, enum: ['primary', 'secondary', 'tertiary'] },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Occasion Schema
export const OccasionSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tagline: { type: String },
    description: { type: String },
    image: { type: String, required: true },
    imageAlt: { type: String },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Order Schema
export const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: String },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: {
      recipientName: { type: String, required: true },
      street: { type: String, required: true },
      district: { type: String, required: true },
      notes: { type: String },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        sku: { type: String },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        personalization: {
          recipientName: String,
          message: String,
          waxSealColor: String,
          fontStyle: String,
        },
      },
    ],
    giftWrap: {
      selected: { type: Boolean, default: false },
      price: { type: Number, default: 0 },
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['card', 'koko', 'mintpay', 'cod'], required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    fulfillmentStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: { type: String },
    statusHistory: [
      {
        status: { type: String, required: true },
        note: { type: String },
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Coupon Schema
export const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    startDate: { type: Date },
    expiryDate: { type: Date },
    usageLimit: { type: Number, default: 100 },
    usageCount: { type: Number, default: 0 },
    perCustomerLimit: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Inventory Movement Schema
export const InventoryMovementSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    changeQuantity: { type: Number, required: true },
    previousQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    reason: {
      type: String,
      enum: ['order_placed', 'order_cancelled', 'restock', 'manual_adjustment', 'damage'],
      required: true,
    },
    referenceId: { type: String },
  },
  { timestamps: true }
);

// Homepage Content Schema
export const HomepageContentSchema = new Schema(
  {
    announcementText: { type: String, required: true },
    promoCode: { type: String, required: true },
    promoDiscountPercent: { type: Number, default: 10 },
    heroEyebrow: { type: String, default: 'The Art of Giving' },
    heroHeadline: { type: String, required: true },
    heroItalicWord: { type: String, default: 'unforgettable.' },
    heroDescription: { type: String, required: true },
    heroImage: { type: String, required: true },
    complimentaryDetailNote: { type: String, required: true },
    journalTitle: { type: String, default: 'A thoughtful note, now and then.' },
    journalSubtitle: { type: String, required: true },
  },
  { timestamps: true }
);

// Audit Log Schema
export const AuditLogSchema = new Schema(
  {
    adminId: { type: String, required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const OccasionModel = mongoose.models.Occasion || mongoose.model('Occasion', OccasionSchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const CouponModel = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
export const InventoryMovementModel =
  mongoose.models.InventoryMovement || mongoose.model('InventoryMovement', InventoryMovementSchema);
export const HomepageContentModel =
  mongoose.models.HomepageContent || mongoose.model('HomepageContent', HomepageContentSchema);
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
