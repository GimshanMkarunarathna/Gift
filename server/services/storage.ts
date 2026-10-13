import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  UserDocument,
  ProductDocument,
  CategoryDocument,
  OccasionDocument,
  OrderDocument,
  CouponDocument,
  InventoryMovementDocument,
  HomepageContentDocument,
  AuditLogDocument,
  GifyAssetDocument,
  CuteAccessoryDocument,
  CustomGifyRequestDocument,
  BrandSettingsDocument,
} from '../models/types';
import {
  BRAND_LOGO,
  HERO_IMAGE,
  PRODUCTS as INITIAL_PRODUCTS,
  CATEGORIES as INITIAL_CATEGORIES,
  OCCASIONS as INITIAL_OCCASIONS,
} from '../../src/data/mockData';

interface DatabaseState {
  users: UserDocument[];
  products: ProductDocument[];
  categories: CategoryDocument[];
  occasions: OccasionDocument[];
  orders: OrderDocument[];
  coupons: CouponDocument[];
  inventoryMovements: InventoryMovementDocument[];
  homepageContent: HomepageContentDocument;
  auditLogs: AuditLogDocument[];
  gifyAssets: GifyAssetDocument[];
  cuteAccessories: CuteAccessoryDocument[];
  customRequests: CustomGifyRequestDocument[];
  brandSettings: BrandSettingsDocument;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'giftora-db.json');

class StorageService {
  private state: DatabaseState | null = null;
  private isSaving = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (this.state) return;

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.state = JSON.parse(raw);
        let needSave = false;
        if (!this.state!.gifyAssets || !Array.isArray(this.state!.gifyAssets)) {
          this.state!.gifyAssets = this.createInitialGifyAssets();
          needSave = true;
        }
        if (!this.state!.cuteAccessories || !Array.isArray(this.state!.cuteAccessories)) {
          this.state!.cuteAccessories = this.createInitialCuteAccessories();
          needSave = true;
        }
        if (!this.state!.customRequests || !Array.isArray(this.state!.customRequests)) {
          this.state!.customRequests = this.createInitialCustomRequests();
          needSave = true;
        }
        if (!this.state!.brandSettings) {
          this.state!.brandSettings = this.createInitialBrandSettings();
          needSave = true;
        }
        if (needSave) {
          this.persist();
        }
        return;
      } catch (err) {
        console.error('Failed to parse existing giftora-db.json, creating initial seed', err);
      }
    }

    this.state = this.createInitialSeed();
    this.persist();
  }

  private createInitialSeed(): DatabaseState {
    const adminPasswordHash = bcrypt.hashSync('GiftoraAdmin2027!', 10);
    const customerPasswordHash = bcrypt.hashSync('Customer123!', 10);

    const now = new Date().toISOString();

    const users: UserDocument[] = [
      {
        id: 'user-admin-1',
        email: 'admin@giftora.lk',
        passwordHash: adminPasswordHash,
        name: 'GIFTORA Lead Curator',
        role: 'admin',
        phone: '+94 11 234 5678',
        address: 'Horton Place, Colombo 07',
        status: 'active',
        createdAt: now,
      },
      {
        id: 'user-customer-1',
        email: 'udara@giftora.lk',
        passwordHash: customerPasswordHash,
        name: 'Udara Fernando',
        role: 'customer',
        phone: '+94 77 987 6543',
        address: 'Colombo 07, Western Province',
        status: 'active',
        createdAt: now,
      },
    ];

    const products: ProductDocument[] = INITIAL_PRODUCTS.map((p, idx) => ({
      id: p.id,
      name: p.title,
      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      sku: `GFT-${1000 + idx}`,
      description: p.description,
      subtitle: p.subtitle,
      price: p.price,
      image: p.image,
      category: p.category,
      recipient: ['Partner', 'Friend', 'Mother', 'Father', 'Sibling', 'Colleague'],
      occasion: p.occasion,
      tags: p.featureTag ? [p.featureTag] : [],
      stockQuantity: 25 + idx * 5,
      lowStockThreshold: 5,
      isPersonalizable: p.isPersonalizable ?? true,
      personalizationOptions: {
        calligraphyNote: true,
        waxSealStamp: true,
        laserEngraving: p.featureTag === 'Laser Engraved',
      },
      giftWrappingAvailable: true,
      isFeatured: true,
      isBestSeller: p.badge === 'Best Seller',
      rating: p.rating,
      reviewCount: p.reviewCount,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    }));

    const categories: CategoryDocument[] = INITIAL_CATEGORIES.map((c, idx) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: `Curated handcrafted treasures for ${c.name}.`,
      image: c.image,
      imageAlt: c.imageAlt,
      badge: c.badge,
      badgeType: c.badgeType,
      displayOrder: idx + 1,
      isActive: true,
      createdAt: now,
    }));

    const occasions: OccasionDocument[] = INITIAL_OCCASIONS.map((o, idx) => ({
      id: o.id,
      title: o.title,
      slug: o.slug,
      tagline: o.tagline,
      description: o.description,
      image: o.image,
      imageAlt: o.imageAlt,
      displayOrder: idx + 1,
      isActive: true,
    }));

    const coupons: CouponDocument[] = [
      {
        id: 'cpn-1',
        code: 'FIRSTJOY',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 0,
        maxDiscount: 2500,
        usageLimit: 1000,
        usageCount: 14,
        perCustomerLimit: 1,
        isActive: true,
        createdAt: now,
      },
      {
        id: 'cpn-2',
        code: 'CEYLONLUX',
        discountType: 'fixed',
        discountValue: 500,
        minOrderAmount: 4000,
        usageLimit: 200,
        usageCount: 3,
        perCustomerLimit: 1,
        isActive: true,
        createdAt: now,
      },
    ];

    const initialOrder: OrderDocument = {
      id: 'ord-1001',
      orderNumber: 'GF-88421',
      customerName: 'Dilani Perera',
      customerEmail: 'dilani.p@gmail.com',
      customerPhone: '+94 77 123 4567',
      deliveryAddress: {
        recipientName: 'Dilani Perera',
        street: 'No. 18/4, Flower Road, Colombo 07',
        district: 'Colombo (Express Same-Day)',
        notes: 'Please ring the front bell and hand directly to recipient.',
      },
      items: [
        {
          productId: 'prod-1',
          name: 'Good Vibes Gift Box',
          sku: 'GFT-1000',
          unitPrice: 3499,
          quantity: 1,
          image: INITIAL_PRODUCTS[0].image,
          personalization: {
            recipientName: 'Ruwini',
            message: 'Wishing you boundless happiness on your graduation!',
            waxSealColor: 'Signature Burgundy',
            fontStyle: 'Calligraphy',
          },
        },
      ],
      giftWrap: {
        selected: true,
        price: 0,
      },
      subtotal: 3499,
      discount: 350,
      couponCode: 'FIRSTJOY',
      deliveryFee: 450,
      total: 3599,
      paymentMethod: 'card',
      paymentStatus: 'paid',
      fulfillmentStatus: 'shipped',
      trackingNumber: 'GF-EXP-88421',
      statusHistory: [
        {
          status: 'pending',
          note: 'Order placed by client from Colombo 07',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          status: 'confirmed',
          note: 'Payment authorized via SSL Gateway',
          timestamp: new Date(Date.now() - 72000000).toISOString(),
        },
        {
          status: 'packed',
          note: 'Calligraphy note card sealed with molten wine wax and blush ribbon',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          updatedBy: 'Atelier Lead',
        },
        {
          status: 'shipped',
          note: 'Dispatched with Express Ceylon Courier tracking GF-EXP-88421',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          updatedBy: 'Logistics Desk',
        },
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 14400000).toISOString(),
    };

    const homepageContent: HomepageContentDocument = {
      announcementText: 'Complimentary luxury gift wrapping on orders over LKR 5,000',
      promoCode: 'FIRSTJOY',
      promoDiscountPercent: 10,
      heroEyebrow: 'The Art of Giving',
      heroHeadline: 'Make it personal.',
      heroItalicWord: 'unforgettable.',
      heroDescription:
        'Thoughtfully chosen gifts for the people who matter most. Discover something meaningful for every moment, beautifully wrapped and delivered across Sri Lanka.',
      heroImage: HERO_IMAGE,
      complimentaryDetailNote:
        'Hand-lettered calligraphy card sealed with signature wine wax.',
      journalTitle: 'The Giftora Journal',
      journalSubtitle:
        'Discover new curated arrivals, thoughtful gifting reminders for anniversaries and birthdays, and private festive collections.',
      updatedAt: now,
    };

    const auditLogs: AuditLogDocument[] = [
      {
        id: 'audit-1',
        adminId: 'user-admin-1',
        adminEmail: 'admin@giftora.lk',
        action: 'system_initialized',
        resource: 'system',
        details: { message: 'Initial GIFTORA Luxury database initialized with verified artisans' },
        timestamp: now,
      },
    ];

    return {
      users,
      products,
      categories,
      occasions,
      orders: [initialOrder],
      coupons,
      inventoryMovements: [],
      homepageContent,
      auditLogs,
      gifyAssets: this.createInitialGifyAssets(),
      cuteAccessories: this.createInitialCuteAccessories(),
      customRequests: this.createInitialCustomRequests(),
      brandSettings: this.createInitialBrandSettings(),
    };
  }

  private persist() {
    if (!this.state) return;
    try {
      this.isSaving = true;
      fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file', err);
    } finally {
      this.isSaving = false;
    }
  }

  // --- Users ---
  getUsers(): UserDocument[] {
    this.ensureInitialized();
    return this.state!.users;
  }

  getUserByEmail(email: string): UserDocument | undefined {
    this.ensureInitialized();
    return this.state!.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): UserDocument | undefined {
    this.ensureInitialized();
    return this.state!.users.find((u) => u.id === id);
  }

  createUser(user: Omit<UserDocument, 'id' | 'createdAt'>): UserDocument {
    this.ensureInitialized();
    const newUser: UserDocument = {
      ...user,
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.state!.users.push(newUser);
    this.persist();
    return newUser;
  }

  updateUser(id: string, updates: Partial<UserDocument>): UserDocument | null {
    this.ensureInitialized();
    const idx = this.state!.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.state!.users[idx] = { ...this.state!.users[idx], ...updates };
    this.persist();
    return this.state!.users[idx];
  }

  // --- Products ---
  getProducts(): ProductDocument[] {
    this.ensureInitialized();
    return this.state!.products;
  }

  getProductById(id: string): ProductDocument | undefined {
    this.ensureInitialized();
    return this.state!.products.find((p) => p.id === id || p.slug === id);
  }

  createProduct(product: Omit<ProductDocument, 'id' | 'createdAt' | 'updatedAt'>): ProductDocument {
    this.ensureInitialized();
    const now = new Date().toISOString();
    const newProduct: ProductDocument = {
      ...product,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.state!.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<ProductDocument>): ProductDocument | null {
    this.ensureInitialized();
    const idx = this.state!.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.state!.products[idx] = {
      ...this.state!.products[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.state!.products[idx];
  }

  deleteProduct(id: string, soft = true): boolean {
    this.ensureInitialized();
    const idx = this.state!.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    if (soft) {
      this.state!.products[idx].status = 'archived';
      this.state!.products[idx].updatedAt = new Date().toISOString();
    } else {
      this.state!.products.splice(idx, 1);
    }
    this.persist();
    return true;
  }

  // --- Categories ---
  getCategories(): CategoryDocument[] {
    this.ensureInitialized();
    return this.state!.categories;
  }

  createCategory(category: Omit<CategoryDocument, 'id' | 'createdAt'>): CategoryDocument {
    this.ensureInitialized();
    const newCat: CategoryDocument = {
      ...category,
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.state!.categories.push(newCat);
    this.persist();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<CategoryDocument>): CategoryDocument | null {
    this.ensureInitialized();
    const idx = this.state!.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.state!.categories[idx] = { ...this.state!.categories[idx], ...updates };
    this.persist();
    return this.state!.categories[idx];
  }

  deleteCategory(id: string): boolean {
    this.ensureInitialized();
    const idx = this.state!.categories.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.state!.categories.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Occasions ---
  getOccasions(): OccasionDocument[] {
    this.ensureInitialized();
    return this.state!.occasions;
  }

  createOccasion(occ: Omit<OccasionDocument, 'id'>): OccasionDocument {
    this.ensureInitialized();
    const newOcc: OccasionDocument = {
      ...occ,
      id: `occ-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    this.state!.occasions.push(newOcc);
    this.persist();
    return newOcc;
  }

  updateOccasion(id: string, updates: Partial<OccasionDocument>): OccasionDocument | null {
    this.ensureInitialized();
    const idx = this.state!.occasions.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    this.state!.occasions[idx] = { ...this.state!.occasions[idx], ...updates };
    this.persist();
    return this.state!.occasions[idx];
  }

  // --- Orders ---
  getOrders(): OrderDocument[] {
    this.ensureInitialized();
    return this.state!.orders;
  }

  getOrderById(id: string): OrderDocument | undefined {
    this.ensureInitialized();
    return this.state!.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: Omit<OrderDocument, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): OrderDocument {
    this.ensureInitialized();
    const now = new Date().toISOString();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `GF-${randomDigits}`;

    const newOrder: OrderDocument = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      statusHistory: [
        {
          status: orderData.fulfillmentStatus,
          note: 'Order placed by client and verified by system',
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    // Deduct inventory atomically
    for (const item of newOrder.items) {
      const prod = this.state!.products.find((p) => p.id === item.productId);
      if (prod) {
        const prev = prod.stockQuantity;
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        prod.updatedAt = now;

        this.recordInventoryMovement({
          productId: prod.id,
          productName: prod.name,
          changeQuantity: -item.quantity,
          previousQuantity: prev,
          newQuantity: prod.stockQuantity,
          reason: 'order_placed',
          referenceId: orderNumber,
        });
      }
    }

    this.state!.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  updateOrderStatus(
    id: string,
    fulfillmentStatus: OrderDocument['fulfillmentStatus'],
    note?: string,
    updatedBy?: string
  ): OrderDocument | null {
    this.ensureInitialized();
    const order = this.state!.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return null;

    const now = new Date().toISOString();
    order.fulfillmentStatus = fulfillmentStatus;
    order.updatedAt = now;
    order.statusHistory.push({
      status: fulfillmentStatus,
      note: note || `Status updated to ${fulfillmentStatus}`,
      timestamp: now,
      updatedBy,
    });

    // If cancelled, restore inventory
    if (fulfillmentStatus === 'cancelled') {
      for (const item of order.items) {
        const prod = this.state!.products.find((p) => p.id === item.productId);
        if (prod) {
          const prev = prod.stockQuantity;
          prod.stockQuantity += item.quantity;
          prod.updatedAt = now;

          this.recordInventoryMovement({
            productId: prod.id,
            productName: prod.name,
            changeQuantity: item.quantity,
            previousQuantity: prev,
            newQuantity: prod.stockQuantity,
            reason: 'order_cancelled',
            referenceId: order.orderNumber,
          });
        }
      }
    }

    this.persist();
    return order;
  }

  updateOrderTracking(id: string, trackingNumber: string): OrderDocument | null {
    this.ensureInitialized();
    const order = this.state!.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();
    this.persist();
    return order;
  }

  // --- Inventory Movements ---
  recordInventoryMovement(movement: Omit<InventoryMovementDocument, 'id' | 'createdAt'>): InventoryMovementDocument {
    this.ensureInitialized();
    const doc: InventoryMovementDocument = {
      ...movement,
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.state!.inventoryMovements.unshift(doc);
    this.persist();
    return doc;
  }

  getInventoryMovements(): InventoryMovementDocument[] {
    this.ensureInitialized();
    return this.state!.inventoryMovements;
  }

  // --- Coupons ---
  getCoupons(): CouponDocument[] {
    this.ensureInitialized();
    return this.state!.coupons;
  }

  getCouponByCode(code: string): CouponDocument | undefined {
    this.ensureInitialized();
    return this.state!.coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
  }

  createCoupon(coupon: Omit<CouponDocument, 'id' | 'createdAt' | 'usageCount'>): CouponDocument {
    this.ensureInitialized();
    const newCoupon: CouponDocument = {
      ...coupon,
      code: coupon.code.toUpperCase().trim(),
      id: `cpn-${Date.now()}`,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.state!.coupons.push(newCoupon);
    this.persist();
    return newCoupon;
  }

  updateCoupon(id: string, updates: Partial<CouponDocument>): CouponDocument | null {
    this.ensureInitialized();
    const idx = this.state!.coupons.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.state!.coupons[idx] = { ...this.state!.coupons[idx], ...updates };
    this.persist();
    return this.state!.coupons[idx];
  }

  deleteCoupon(id: string): boolean {
    this.ensureInitialized();
    const idx = this.state!.coupons.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.state!.coupons.splice(idx, 1);
    this.persist();
    return true;
  }

  incrementCouponUsage(id: string) {
    this.ensureInitialized();
    const coupon = this.state!.coupons.find((c) => c.id === id);
    if (coupon) {
      coupon.usageCount += 1;
      this.persist();
    }
  }

  // --- Homepage Content ---
  getHomepageContent(): HomepageContentDocument {
    this.ensureInitialized();
    return this.state!.homepageContent;
  }

  updateHomepageContent(updates: Partial<HomepageContentDocument>): HomepageContentDocument {
    this.ensureInitialized();
    this.state!.homepageContent = {
      ...this.state!.homepageContent,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.state!.homepageContent;
  }

  // --- Audit Logs ---
  addAuditLog(log: Omit<AuditLogDocument, 'id' | 'timestamp'>): AuditLogDocument {
    this.ensureInitialized();
    const newLog: AuditLogDocument = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.state!.auditLogs.unshift(newLog);
    this.persist();
    return newLog;
  }

  getAuditLogs(): AuditLogDocument[] {
    this.ensureInitialized();
    return this.state!.auditLogs;
  }

  // --- Seed Helpers ---
  private createInitialGifyAssets(): GifyAssetDocument[] {
    const now = new Date().toISOString();
    return [
      {
        id: 'asset-lily',
        title: 'Unfurling Lily',
        name: 'Unfurling Lily',
        animationPreset: 'bloom',
        category: 'Botanical',
        previewEmoji: '🌸',
        svgIcon: 'local_florist',
        tag: 'Signature',
        color: '#4CAF50',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'asset-bunny',
        title: 'Dancing Meadow Bunny',
        name: 'Dancing Meadow Bunny',
        animationPreset: 'bounce',
        category: 'Kawaii',
        previewEmoji: '🐰',
        svgIcon: 'cruelty_free',
        tag: 'Cute',
        color: '#FFA5B7',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'asset-butterfly',
        title: 'Fluttering Silk Butterfly',
        name: 'Fluttering Silk Butterfly',
        animationPreset: 'breeze',
        category: 'Whimsical',
        previewEmoji: '🦋',
        svgIcon: 'flutter',
        tag: 'Airy',
        color: '#64B5F6',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'asset-kitten',
        title: 'Curled Sleeping Kitten',
        name: 'Curled Sleeping Kitten',
        animationPreset: 'gentle-sway',
        category: 'Kawaii',
        previewEmoji: '🐱',
        svgIcon: 'pets',
        tag: 'Sweet',
        color: '#FFB74D',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'asset-stars',
        title: 'Four-Point Twinkle Stars',
        name: 'Four-Point Twinkle Stars',
        animationPreset: 'sparkle-pulse',
        category: 'Sparkles',
        previewEmoji: '✨',
        svgIcon: 'auto_awesome',
        tag: 'Glow',
        color: '#E9C46A',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'asset-tea',
        title: 'Floral Porcelain Teacup',
        name: 'Floral Porcelain Teacup',
        animationPreset: 'gentle-sway',
        category: 'Whimsical',
        previewEmoji: '☕',
        svgIcon: 'coffee',
        tag: 'Cozy',
        color: '#81C784',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'asset-clover',
        title: 'Glück Lucky 4-Leaf Clover',
        name: 'Glück Lucky 4-Leaf Clover',
        animationPreset: 'bloom',
        category: 'Botanical',
        previewEmoji: '🍀',
        svgIcon: 'eco',
        tag: 'Lucky',
        color: '#2D6A4F',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'asset-cloud',
        title: 'Pastel Rainbow Cloud',
        name: 'Pastel Rainbow Cloud',
        animationPreset: 'breeze',
        category: 'Kawaii',
        previewEmoji: '☁️',
        svgIcon: 'cloud',
        tag: 'Dreamy',
        color: '#BA68C8',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  private createInitialCuteAccessories(): CuteAccessoryDocument[] {
    const now = new Date().toISOString();
    return [
      {
        id: 'acc-pin',
        title: 'Lily Blossom Enamel Pin',
        name: 'Lily Blossom Enamel Pin',
        sku: 'GK-PIN-01',
        price: 1850,
        stock: 42,
        imageUrl: 'https://images.unsplash.com/photo-1611591475878-83141dfd16a5?auto=format&fit=crop&w=500&q=80',
        description: 'Hand-dipped soft white enamel lily with polished gold border and butterfly clasp.',
        category: 'Jewelry & Pins',
        badge: 'Bestseller',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'acc-scarf',
        title: 'Botanical Lily Silk Scarf',
        name: 'Botanical Lily Silk Scarf',
        sku: 'GK-SCF-02',
        price: 6400,
        stock: 14,
        imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=500&q=80',
        description: '100% pure mulberry silk scarf with hand-rolled hems and illustrated botanical lilies.',
        category: 'Wearables',
        badge: 'Limited',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'acc-notebook',
        title: 'Embossed Lily Hardcover Journal',
        name: 'Embossed Lily Hardcover Journal',
        sku: 'GK-NB-03',
        price: 2750,
        stock: 36,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
        description: '160gsm bamboo paper with gold-stamped lily emblem, ribbon bookmark, and elastic closure.',
        category: 'Stationery',
        badge: 'Artisan',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'acc-pouch',
        title: 'Botanical Linen Atelier Pouch',
        name: 'Botanical Linen Atelier Pouch',
        sku: 'GK-PCH-04',
        price: 2200,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80',
        description: 'Hand-woven natural organic flax linen pouch featuring floral screen-printed motif and brass zipper.',
        category: 'Organizers',
        badge: 'Eco-Friendly',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'acc-mug',
        title: 'Glück Lily Ceramic Teacup',
        name: 'Glück Lily Ceramic Teacup',
        sku: 'GK-MUG-05',
        price: 2950,
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
        description: 'Double-glazed porcelain cup hand-thrown with lily petal contours and 24K gold rim highlight.',
        category: 'Drinkware',
        badge: 'Artisan',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  private createInitialCustomRequests(): CustomGifyRequestDocument[] {
    const now = new Date().toISOString();
    return [
      {
        id: 'req-201',
        requestNumber: 'GG-REQ-201',
        title: 'Whimsical Lily Bloom with Twinkles',
        customerName: 'Aanya Senanayake',
        customerEmail: 'aanya.s@outlook.com',
        motif: 'lily',
        caption: 'Wishing you sheer peace and joy on your graduation day ✨',
        colorTheme: 'lily-green',
        animationSpeed: 'gentle',
        stickers: ['sparkles', 'lily'],
        requestType: 'custom_gify',
        status: 'pending',
        amount: 2500,
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        updatedAt: now,
      },
      {
        id: 'req-202',
        requestNumber: 'GG-REQ-202',
        title: 'Bunny Meadow Birthday Keepsake',
        customerName: 'Kasun Wickramasinghe',
        customerEmail: 'kasun.w@gmail.com',
        motif: 'bunny',
        caption: 'Happy Sweet 16, keep hopping high! 🐰🌸',
        colorTheme: 'rose-blush',
        animationSpeed: 'bloom',
        stickers: ['bunny', 'sparkles'],
        requestType: 'custom_gify',
        status: 'processing',
        amount: 3200,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: now,
      },
      {
        id: 'req-203',
        requestNumber: 'GG-REQ-203',
        title: 'Custom Lily Pin & Scarf Duo Gift Set',
        customerName: 'Nadia Rahim',
        customerEmail: 'nadia.r@yahoo.com',
        motif: 'lily',
        caption: 'For Dearest Mother with unending love.',
        colorTheme: 'lily-green',
        animationSpeed: 'breeze',
        stickers: ['sparkles'],
        requestType: 'accessory_order',
        status: 'completed',
        amount: 8250,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: now,
      },
    ];
  }

  private createInitialBrandSettings(): BrandSettingsDocument {
    return {
      brandName: 'GLÜCK GIFY',
      tagline: 'CUTE GIFY AND ACCESSORIES',
      logoUrl: '/logo.png',
      logoFallbackMode: 'auto',
      announcementText: 'Welcome to GLÜCK GIFY: Cute Gify & Botanical Accessories ✨ Free Keepsake Wrapping',
      announcementActive: true,
      loadingBloomSpeed: 2800,
      pageTransitions: true,
      primaryAccent: '#4CAF50',
      secondaryAccent: '#2B2D2F',
      highlightAccent: '#FAF9F6',
      goldAccent: '#E9C46A',
      updatedAt: new Date().toISOString(),
    };
  }

  // --- Gify Assets Management ---
  getGifyAssets(status?: string): GifyAssetDocument[] {
    this.ensureInitialized();
    if (!status || status === 'all') return this.state!.gifyAssets;
    return this.state!.gifyAssets.filter((a) => a.status === status);
  }

  getGifyAssetById(id: string): GifyAssetDocument | undefined {
    this.ensureInitialized();
    return this.state!.gifyAssets.find((a) => a.id === id);
  }

  createGifyAsset(data: Omit<GifyAssetDocument, 'id' | 'createdAt' | 'updatedAt'>): GifyAssetDocument {
    this.ensureInitialized();
    const now = new Date().toISOString();
    const newAsset: GifyAssetDocument = {
      ...data,
      id: `asset-${Date.now()}`,
      title: data.title || data.name,
      createdAt: now,
      updatedAt: now,
    };
    this.state!.gifyAssets.unshift(newAsset);
    this.persist();
    return newAsset;
  }

  updateGifyAsset(id: string, updates: Partial<GifyAssetDocument>): GifyAssetDocument | null {
    this.ensureInitialized();
    const idx = this.state!.gifyAssets.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.state!.gifyAssets[idx] = {
      ...this.state!.gifyAssets[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.state!.gifyAssets[idx];
  }

  deleteGifyAsset(id: string): boolean {
    this.ensureInitialized();
    const idx = this.state!.gifyAssets.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.state!.gifyAssets.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Cute Accessories Management ---
  getCuteAccessories(status?: string): CuteAccessoryDocument[] {
    this.ensureInitialized();
    if (!status || status === 'all') return this.state!.cuteAccessories;
    return this.state!.cuteAccessories.filter((a) => a.status === status);
  }

  getCuteAccessoryById(id: string): CuteAccessoryDocument | undefined {
    this.ensureInitialized();
    return this.state!.cuteAccessories.find((a) => a.id === id);
  }

  createCuteAccessory(data: Omit<CuteAccessoryDocument, 'id' | 'createdAt' | 'updatedAt'>): CuteAccessoryDocument {
    this.ensureInitialized();
    const now = new Date().toISOString();
    const newAcc: CuteAccessoryDocument = {
      ...data,
      id: `acc-${Date.now()}`,
      title: data.title || data.name,
      createdAt: now,
      updatedAt: now,
    };
    this.state!.cuteAccessories.unshift(newAcc);
    this.persist();
    return newAcc;
  }

  updateCuteAccessory(id: string, updates: Partial<CuteAccessoryDocument>): CuteAccessoryDocument | null {
    this.ensureInitialized();
    const idx = this.state!.cuteAccessories.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.state!.cuteAccessories[idx] = {
      ...this.state!.cuteAccessories[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.state!.cuteAccessories[idx];
  }

  deleteCuteAccessory(id: string): boolean {
    this.ensureInitialized();
    const idx = this.state!.cuteAccessories.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.state!.cuteAccessories.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Order & Custom Maker Requests ---
  getCustomRequests(status?: string): CustomGifyRequestDocument[] {
    this.ensureInitialized();
    if (!status || status === 'all') return this.state!.customRequests;
    return this.state!.customRequests.filter((r) => r.status === status);
  }

  getCustomRequestById(id: string): CustomGifyRequestDocument | undefined {
    this.ensureInitialized();
    return this.state!.customRequests.find((r) => r.id === id);
  }

  createCustomRequest(
    data: Omit<CustomGifyRequestDocument, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt'>
  ): CustomGifyRequestDocument {
    this.ensureInitialized();
    const now = new Date().toISOString();
    const num = Math.floor(100 + Math.random() * 900);
    const newReq: CustomGifyRequestDocument = {
      ...data,
      id: `req-${Date.now()}`,
      requestNumber: `GG-REQ-${num}`,
      status: data.status || 'pending',
      createdAt: now,
      updatedAt: now,
    };
    this.state!.customRequests.unshift(newReq);
    this.persist();
    return newReq;
  }

  updateCustomRequestStatus(
    id: string,
    status: CustomGifyRequestDocument['status']
  ): CustomGifyRequestDocument | null {
    this.ensureInitialized();
    const idx = this.state!.customRequests.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.state!.customRequests[idx].status = status;
    this.state!.customRequests[idx].updatedAt = new Date().toISOString();
    this.persist();
    return this.state!.customRequests[idx];
  }

  deleteCustomRequest(id: string): boolean {
    this.ensureInitialized();
    const idx = this.state!.customRequests.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.state!.customRequests.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Brand Settings & Theme Configuration ---
  getBrandSettings(): BrandSettingsDocument {
    this.ensureInitialized();
    return this.state!.brandSettings;
  }

  updateBrandSettings(updates: Partial<BrandSettingsDocument>): BrandSettingsDocument {
    this.ensureInitialized();
    this.state!.brandSettings = {
      ...this.state!.brandSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.state!.brandSettings;
  }
}

export const storage = new StorageService();

