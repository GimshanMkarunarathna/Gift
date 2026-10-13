import { Product } from '../types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  phone?: string;
  address?: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('giftora_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  // Auth
  auth: {
    async login(email: string, password: string) {
      const res = await request<{ message: string; token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.token) {
        localStorage.setItem('giftora_token', res.token);
      }
      return res;
    },
    async register(data: { email: string; password: string; name: string; phone?: string; address?: string }) {
      const res = await request<{ message: string; token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) {
        localStorage.setItem('giftora_token', res.token);
      }
      return res;
    },
    async logout() {
      localStorage.removeItem('giftora_token');
      return request<{ message: string }>('/api/auth/logout', { method: 'POST' });
    },
    async getMe() {
      return request<{ user: User | null }>('/api/auth/me');
    },
  },

  // Products
  products: {
    async getAll(params: Record<string, string | number | boolean> = {}) {
      const query = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString();
      return request<{ total: number; products: any[] }>(`/api/products${query ? `?${query}` : ''}`);
    },
    async getById(id: string) {
      return request<{ product: any }>(`/api/products/${id}`);
    },
    async create(productData: any) {
      return request<{ message: string; product: any }>('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    },
    async update(id: string, updates: any) {
      return request<{ message: string; product: any }>(`/api/admin/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    async delete(id: string) {
      return request<{ message: string }>(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Categories & Occasions
  categories: {
    async getCategories(includeAll = false) {
      return request<{ categories: any[] }>(`/api/categories${includeAll ? '?includeAll=true' : ''}`);
    },
    async createCategory(data: any) {
      return request<{ category: any }>('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async updateCategory(id: string, updates: any) {
      return request<{ category: any }>(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    async deleteCategory(id: string) {
      return request<{ message: string }>(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
    },
    async getOccasions(includeAll = false) {
      return request<{ occasions: any[] }>(`/api/occasions${includeAll ? '?includeAll=true' : ''}`);
    },
    async createOccasion(data: any) {
      return request<{ occasion: any }>('/api/admin/occasions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async updateOccasion(id: string, updates: any) {
      return request<{ occasion: any }>(`/api/admin/occasions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
  },

  // Orders
  orders: {
    async create(orderData: any) {
      return request<{ message: string; order: any }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    },
    async track(orderNumber: string) {
      return request<any>(`/api/orders/track/${encodeURIComponent(orderNumber)}`);
    },
    async getMyOrders(email?: string) {
      return request<{ orders: any[] }>(`/api/orders${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    },
    async getAllAdmin(params: Record<string, string> = {}) {
      const query = new URLSearchParams(params).toString();
      return request<{ total: number; orders: any[] }>(`/api/orders/admin/all${query ? `?${query}` : ''}`);
    },
    async updateStatus(id: string, status: string, note?: string) {
      return request<{ message: string; order: any }>(`/api/orders/admin/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      });
    },
    async updateTracking(id: string, trackingNumber: string) {
      return request<{ message: string; order: any }>(`/api/orders/admin/${id}/tracking`, {
        method: 'PATCH',
        body: JSON.stringify({ trackingNumber }),
      });
    },
  },

  // Inventory
  inventory: {
    async get() {
      return request<{
        totalItems: number;
        lowStockCount: number;
        outOfStockCount: number;
        inventory: any[];
        recentMovements: any[];
      }>('/api/admin/inventory');
    },
    async adjustStock(id: string, changeQuantity: number, reason: string, note?: string) {
      return request<any>(`/api/admin/inventory/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ changeQuantity, reason, note }),
      });
    },
  },

  // Customers
  customers: {
    async getAll(search?: string) {
      return request<{ total: number; customers: any[] }>(
        `/api/admin/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`
      );
    },
    async getById(id: string) {
      return request<{ customer: any }>(`/api/admin/customers/${id}`);
    },
    async updateStatus(id: string, status: string) {
      return request<{ customer: any }>(`/api/admin/customers/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
  },

  // Coupons
  coupons: {
    async validate(code: string, subtotal: number) {
      return request<{
        valid: boolean;
        code: string;
        discountType: string;
        discountValue: number;
        calculatedDiscount: number;
      }>(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
    },
    async getAll() {
      return request<{ coupons: any[] }>('/api/coupons/admin');
    },
    async create(data: any) {
      return request<{ message: string; coupon: any }>('/api/coupons/admin', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async update(id: string, updates: any) {
      return request<{ message: string; coupon: any }>(`/api/coupons/admin/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    async delete(id: string) {
      return request<{ message: string }>(`/api/coupons/admin/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Dashboard
  dashboard: {
    async getSummary() {
      return request<{
        totalRevenue: number;
        totalOrders: number;
        pendingOrdersCount: number;
        activeProductsCount: number;
        lowStockCount: number;
        registeredCustomersCount: number;
      }>('/api/admin/dashboard/summary');
    },
    async getSales() {
      return request<{ salesTimeline: any[] }>('/api/admin/dashboard/sales');
    },
    async getTopProducts() {
      return request<{ topProducts: any[] }>('/api/admin/dashboard/top-products');
    },
    async getRecentOrders() {
      return request<{ recentOrders: any[] }>('/api/admin/dashboard/recent-orders');
    },
  },

  // Storefront Homepage CMS
  homepage: {
    async get() {
      return request<{ content: any }>('/api/storefront/homepage');
    },
    async update(updates: any) {
      return request<{ message: string; content: any }>('/api/admin/storefront/homepage', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
  },

  // Audit Logs
  audit: {
    async getLogs() {
      return request<{ logs: any[] }>('/api/admin/audit-logs');
    },
  },
};
