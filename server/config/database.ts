import mongoose from 'mongoose';
import {
  UserModel,
  ProductModel,
  CategoryModel,
  OccasionModel,
  OrderModel,
  CouponModel,
  InventoryMovementModel,
  HomepageContentModel,
  AuditLogModel,
} from '../models/mongooseSchemas';
import { storage } from '../services/storage';

let isMongoConnected = false;

export function sanitizeMongoUri(rawUri: string): string | null {
  if (!rawUri || typeof rawUri !== 'string') return null;

  let uri = rawUri.trim();

  // Extract valid mongodb or mongodb+srv connection string even if prefixed by "Value:", "MONGODB_URI=", etc.
  const uriMatch = uri.match(/(mongodb(?:\+srv)?:\/\/[^\s"']+)/);
  if (!uriMatch) {
    return null;
  }
  uri = uriMatch[1];

  // Strip enclosing quotes if any
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1);
  }

  // Strip angle brackets from password: e.g. :<mypass>@ -> :mypass@
  uri = uri.replace(/:<([^>@]+)>@/, ':$1@');

  // If no database name exists between host and ? (e.g. mongodb.net/? -> mongodb.net/giftora?)
  if (uri.includes('.mongodb.net/?')) {
    uri = uri.replace('.mongodb.net/?', '.mongodb.net/giftora?');
  } else if (uri.endsWith('.mongodb.net') || uri.endsWith('.mongodb.net/')) {
    uri = uri.replace(/\.mongodb\.net\/?$/, '.mongodb.net/giftora');
  }

  return uri;
}

export async function connectToDatabase(): Promise<boolean> {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri || rawUri.trim() === '') {
    console.log('[Database] Persistent atomic storage engine active.');
    return false;
  }

  const sanitizedUri = sanitizeMongoUri(rawUri);
  if (!sanitizedUri) {
    console.log('[Database] MONGODB_URI does not contain a valid mongodb:// or mongodb+srv:// scheme. Operating on persistent local storage engine.');
    return false;
  }

  const maskedUri = sanitizedUri.replace(/:([^@]+)@/, ':****@');
  console.log(`[Database] Connecting to MongoDB Atlas (${maskedUri})...`);

  try {
    await mongoose.connect(sanitizedUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });

    isMongoConnected = true;
    console.log('[Database] Successfully connected to MongoDB Atlas!');

    // Synchronize initial data to MongoDB Atlas collections
    await syncLocalStateToMongoDB();
    return true;
  } catch (err: any) {
    isMongoConnected = false;
    console.log(
      `[Database] Note: MongoDB Atlas cluster is currently unreachable from this network IP or credentials require review. Seamlessly operating with persistent local atomic database engine.`
    );
    return false;
  }
}

export function isConnectedToMongoDB(): boolean {
  return isMongoConnected;
}

async function syncLocalStateToMongoDB() {
  try {
    console.log('🔄 Synchronizing database state to MongoDB Atlas collections...');
    
    // 1. Sync Users
    const localUsers = storage.getUsers();
    for (const u of localUsers) {
      await UserModel.findOneAndUpdate(
        { email: u.email },
        {
          $set: {
            email: u.email,
            passwordHash: u.passwordHash,
            name: u.name,
            role: u.role,
            phone: u.phone,
            address: u.address,
            status: u.status,
          },
        },
        { upsert: true, new: true }
      );
    }

    // 2. Sync Products
    const localProducts = storage.getProducts();
    for (const p of localProducts) {
      await ProductModel.findOneAndUpdate(
        { sku: p.sku },
        {
          $set: {
            name: p.name,
            slug: p.slug,
            sku: p.sku,
            subtitle: p.subtitle,
            description: p.description,
            price: p.price,
            salePrice: p.salePrice,
            image: p.image,
            additionalImages: p.additionalImages,
            category: p.category,
            recipient: p.recipient,
            occasion: p.occasion,
            tags: p.tags,
            stockQuantity: p.stockQuantity,
            lowStockThreshold: p.lowStockThreshold,
            isPersonalizable: p.isPersonalizable,
            personalizationOptions: p.personalizationOptions,
            giftWrappingAvailable: p.giftWrappingAvailable,
            isFeatured: p.isFeatured,
            isBestSeller: p.isBestSeller,
            rating: p.rating,
            reviewCount: p.reviewCount,
            status: p.status,
          },
        },
        { upsert: true, new: true }
      );
    }

    // 3. Sync Categories
    const localCategories = storage.getCategories();
    for (const c of localCategories) {
      await CategoryModel.findOneAndUpdate(
        { slug: c.slug },
        {
          $set: {
            name: c.name,
            slug: c.slug,
            description: c.description,
            image: c.image,
            imageAlt: c.imageAlt,
            badge: c.badge,
            badgeType: c.badgeType,
            displayOrder: c.displayOrder,
            isActive: c.isActive,
          },
        },
        { upsert: true, new: true }
      );
    }

    // 4. Sync Occasions
    const localOccasions = storage.getOccasions();
    for (const o of localOccasions) {
      await OccasionModel.findOneAndUpdate(
        { slug: o.slug },
        {
          $set: {
            title: o.title,
            slug: o.slug,
            tagline: o.tagline,
            description: o.description,
            image: o.image,
            imageAlt: o.imageAlt,
            displayOrder: o.displayOrder,
            isActive: o.isActive,
          },
        },
        { upsert: true, new: true }
      );
    }

    // 5. Sync Coupons
    const localCoupons = storage.getCoupons();
    for (const cp of localCoupons) {
      await CouponModel.findOneAndUpdate(
        { code: cp.code },
        {
          $set: {
            code: cp.code,
            discountType: cp.discountType,
            discountValue: cp.discountValue,
            minOrderAmount: cp.minOrderAmount,
            maxDiscount: cp.maxDiscount,
            usageLimit: cp.usageLimit,
            usageCount: cp.usageCount,
            isActive: cp.isActive,
          },
        },
        { upsert: true, new: true }
      );
    }

    // 6. Sync Homepage Content
    const localHomepage = storage.getHomepageContent();
    if (localHomepage) {
      await HomepageContentModel.findOneAndUpdate(
        {},
        { $set: localHomepage },
        { upsert: true, new: true }
      );
    }

    console.log('[Database] Collections synchronized with MongoDB Atlas.');
  } catch (err: any) {
    console.log('[Database] Initial sync note:', err.message);
  }
}
