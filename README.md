# GIFTORA — The Art of Giving
### Full-Stack Luxury E-Commerce & Secure Administrator Portal

An editorial keepsake and luxury gifting boutique crafted for Sri Lanka with persistent database storage, real-time inventory tracking, and a comprehensive Administrator Portal.

---

## 1. System Architecture

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4.
- **Backend**: Node.js + Express.js + TypeScript (running under `tsx server.ts` on port 3000).
- **Database & Persistence**:
  - Mongoose models configured for MongoDB (`server/models/mongooseSchemas.ts`).
  - Persistent, atomic JSON database engine (`data/giftora-db.json`) enabling zero-crash local execution in sandbox environments with instant persistence across restarts.
  - Automatic fallback & synchronization with `MONGODB_URI` when provided.
- **Authentication & Security**:
  - JWT session tokens (HttpOnly cookies + Bearer headers).
  - Password hashing with Bcrypt.
  - In-memory IP rate limiter protecting `/api/auth/login`.
  - Server-side Role-Based Access Control (`admin`, `staff`, `customer`).
  - Immutable audit logs recording all administrative operations.

---

## 2. Administrator Access & Credentials

The database comes pre-seeded with initial verified administrator credentials:

- **Portal URL**: Click **"Admin Portal"** in the top announcement bar or navigate in the app.
- **Admin Email**: `admin@giftora.lk`
- **Admin Password**: `GiftoraAdmin2027!`
- *(A one-click "Fill" helper button is provided on the security gateway modal for evaluation).*

To execute a fresh command-line database seeding:
```bash
npm run seed
```

---

## 3. Core Modules & Endpoints

### 🔐 1. Authentication (`/api/auth`)
- `POST /api/auth/login`: Rate-limited admin & customer login with Bcrypt verification.
- `POST /api/auth/register`: Secure customer account creation.
- `POST /api/auth/logout`: Revokes session cookies.
- `GET /api/auth/me`: Verifies active session token.

### 📦 2. Products & Crafts (`/api/products` & `/api/admin/products`)
- `GET /api/products`: Public filtered catalog (by category, occasion, recipient, price sorting, search).
- `GET /api/products/:id`: Retrieve single product details.
- `POST /api/admin/products`: Create handcrafted products with SKU, pricing, images, and tags.
- `PATCH /api/admin/products/:id`: Update specifications, pricing, and stock.
- `DELETE /api/admin/products/:id`: Soft-archives products to preserve historical order integrity.

### 🗂️ 3. Categories & Occasions (`/api/categories` & `/api/occasions`)
- Complete management of 9 curated departments and 6 milestone collections.
- Dynamic display order, active status toggling, and image management.

### 🚚 4. Orders & Fulfillment (`/api/orders`)
- `POST /api/orders`: Server-side price recalculation (frontend prices are never trusted), stock validation, atomic stock deduction, and coupon application.
- `GET /api/orders/track/:orderNumber`: Public tracking endpoint displaying order timeline (e.g. `GF-88421`).
- `GET /api/orders/admin/all`: Admin order search, filtering by fulfillment and payment status.
- `PATCH /api/orders/admin/:id/status`: Update status (*confirmed*, *packed*, *shipped*, *delivered*, *cancelled* with inventory restoration).
- `PATCH /api/orders/admin/:id/tracking`: Assign express courier tracking numbers.

### 📊 5. Inventory & Movements (`/api/admin/inventory`)
- Live stock balances and automatic low-stock warnings (&le; 5 units).
- Manual adjustment workflows with audited reason tagging (*restock*, *damage*, *audit*).
- Complete historical movement ledger.

### 🎟️ 6. Coupons & Promotions (`/api/coupons`)
- `GET /api/coupons/validate`: Server-side coupon verification (`FIRSTJOY` for 10% off, `CEYLONLUX`).
- Admin CRUD to manage percentage or fixed discounts and minimum order thresholds.

### 👥 7. Customer Directory (`/api/admin/customers`)
- Client registry with total spend, order frequency, and account suspension controls.

### 🖥️ 8. Storefront CMS (`/api/storefront/homepage`)
- Live editable announcement bar, promotional codes, hero headlines, and journal copy.

### 🛡️ 9. Audit Logs (`/api/admin/audit-logs`)
- Timestamped ledger of admin actions, resource IDs, and client IP addresses.

---

## 4. Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Seed database**:
   ```bash
   npm run seed
   ```
3. **Start full-stack server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to interact with both the customer storefront and the administrator portal.
