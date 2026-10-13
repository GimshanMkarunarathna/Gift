import React, { useState, useEffect } from 'react';
import { api, User } from '../../services/api';
import { GluckGifyLogo } from '../brand/GluckGifyLogo';
import { LilyFlowerIcon, SparkleStarIcon, CuteBackpackIcon, GiftRibbonIcon } from '../brand/BrandIcons';
import { AdminOverviewDashboard } from './AdminOverviewDashboard';
import { AdminGifyAssets } from './AdminGifyAssets';
import { AdminCuteAccessories } from './AdminCuteAccessories';
import { AdminCustomRequests } from './AdminCustomRequests';
import { AdminBrandSettings } from './AdminBrandSettings';

interface AdminPortalProps {
  currentUser: User;
  onLogout: () => void;
  onReturnToStorefront: () => void;
  onShowToast: (msg: string) => void;
}

export type AdminSection =
  | 'dashboard'
  | 'studio-assets'
  | 'studio-accessories'
  | 'custom-requests'
  | 'brand-settings'
  | 'products'
  | 'categories'
  | 'orders'
  | 'inventory'
  | 'customers'
  | 'coupons'
  | 'homepage'
  | 'audit';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onLogout,
  onReturnToStorefront,
  onShowToast,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);

  // GLÜCK GIFY Studio Data
  const [gifyAssetsList, setGifyAssetsList] = useState<any[]>([]);
  const [accessoriesList, setAccessoriesList] = useState<any[]>([]);
  const [customRequestsList, setCustomRequestsList] = useState<any[]>([]);

  // Quick Action Modal helpers
  const [isQuickAssetModalOpen, setIsQuickAssetModalOpen] = useState(false);
  const [isQuickAccModalOpen, setIsQuickAccModalOpen] = useState(false);

  // Dashboard Data
  const [summary, setSummary] = useState<any>(null);
  const [salesTimeline, setSalesTimeline] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Products Data
  const [productsList, setProductsList] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Categories & Occasions Data
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [occasionsList, setOccasionsList] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Orders Data
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Inventory Data
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<any[]>([]);
  const [adjustingStockItem, setAdjustingStockItem] = useState<any | null>(null);
  const [stockAdjustmentQty, setStockAdjustmentQty] = useState(5);
  const [stockAdjustmentReason, setStockAdjustmentReason] = useState('restock');

  // Customers Data
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');

  // Coupons Data
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(3000);

  // Homepage CMS Data
  const [homepageContent, setHomepageContent] = useState<any>(null);

  // Audit Logs Data
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);

  // Initial Data Fetch
  useEffect(() => {
    refreshCurrentSection(activeSection);
  }, [activeSection]);

  const refreshCurrentSection = async (section: AdminSection) => {
    setLoading(true);
    try {
      if (section === 'dashboard') {
        const [sum, sales, top, recent, health, assetsRes, accsRes, customReqsRes] = await Promise.all([
          api.dashboard.getSummary(),
          api.dashboard.getSales(),
          api.dashboard.getTopProducts(),
          api.dashboard.getRecentOrders(),
          api.system.getHealth().catch(() => null),
          api.studio.getAssets().catch(() => ({ total: 0, assets: [] })),
          api.studio.getAccessories().catch(() => ({ total: 0, accessories: [] })),
          api.customRequests.getAll().catch(() => ({ total: 0, requests: [] })),
        ]);
        setSummary(sum);
        setSalesTimeline(sales.salesTimeline || []);
        setTopProducts(top.topProducts || []);
        setRecentOrders(recent.recentOrders || []);
        if (health) setDbStatus(health);
        setGifyAssetsList(assetsRes.assets || []);
        setAccessoriesList(accsRes.accessories || []);
        setCustomRequestsList(customReqsRes.requests || []);
      } else if (section === 'studio-assets') {
        const res = await api.studio.getAssets();
        setGifyAssetsList(res.assets || []);
      } else if (section === 'studio-accessories') {
        const res = await api.studio.getAccessories();
        setAccessoriesList(res.accessories || []);
      } else if (section === 'custom-requests') {
        const res = await api.customRequests.getAll();
        setCustomRequestsList(res.requests || []);
      } else if (section === 'products') {
        const res = await api.products.getAll({ includeAll: true });
        setProductsList(res.products || []);
      } else if (section === 'categories') {
        const [cats, occs] = await Promise.all([
          api.categories.getCategories(true),
          api.categories.getOccasions(true),
        ]);
        setCategoriesList(cats.categories || []);
        setOccasionsList(occs.occasions || []);
      } else if (section === 'orders') {
        const res = await api.orders.getAllAdmin({
          search: orderSearch,
          status: orderStatusFilter !== 'all' ? orderStatusFilter : '',
        });
        setOrdersList(res.orders || []);
      } else if (section === 'inventory') {
        const res = await api.inventory.get();
        setInventoryList(res.inventory || []);
        setInventoryMovements(res.recentMovements || []);
      } else if (section === 'customers') {
        const res = await api.customers.getAll(customerSearch);
        setCustomersList(res.customers || []);
      } else if (section === 'coupons') {
        const res = await api.coupons.getAll();
        setCouponsList(res.coupons || []);
      } else if (section === 'homepage') {
        const res = await api.homepage.get();
        setHomepageContent(res.content);
      } else if (section === 'audit') {
        const res = await api.audit.getLogs();
        setAuditLogsList(res.logs || []);
      }
    } catch (err: any) {
      onShowToast(err.message || 'Failed to load section data');
    } finally {
      setLoading(false);
    }
  };

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const productData = {
      name: formData.get('name') as string,
      sku: formData.get('sku') as string,
      subtitle: formData.get('subtitle') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      image: formData.get('image') as string,
      category: formData.get('category') as string,
      occasion: [formData.get('occasion') as string],
      stockQuantity: Number(formData.get('stockQuantity')),
      lowStockThreshold: Number(formData.get('lowStockThreshold') || 5),
      isPersonalizable: formData.get('isPersonalizable') === 'on',
      giftWrappingAvailable: formData.get('giftWrappingAvailable') === 'on',
      status: formData.get('status') as string,
    };

    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, productData);
        onShowToast(`Product "${productData.name}" updated successfully`);
      } else {
        await api.products.create(productData);
        onShowToast(`Product "${productData.name}" created successfully`);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      refreshCurrentSection('products');
    } catch (err: any) {
      onShowToast(err.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to archive product "${name}"?`)) return;
    try {
      await api.products.delete(id);
      onShowToast(`Product "${name}" archived`);
      refreshCurrentSection('products');
    } catch (err: any) {
      onShowToast(err.message || 'Error archiving product');
    }
  };

  // Order Status Update
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
    note?: string
  ) => {
    try {
      await api.orders.updateStatus(orderId, newStatus, note);
      onShowToast(`Order updated to "${newStatus}"`);
      if (selectedOrder) {
        setSelectedOrder((prev: any) => ({ ...prev, fulfillmentStatus: newStatus }));
      }
      refreshCurrentSection('orders');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update order status');
    }
  };

  const handleUpdateTracking = async (orderId: string, trackingNumber: string) => {
    if (!trackingNumber.trim()) return;
    try {
      await api.orders.updateTracking(orderId, trackingNumber.trim());
      onShowToast(`Assigned tracking: ${trackingNumber}`);
      if (selectedOrder) {
        setSelectedOrder((prev: any) => ({ ...prev, trackingNumber }));
      }
      refreshCurrentSection('orders');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update tracking');
    }
  };

  // Inventory Stock Adjustment
  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingStockItem) return;
    try {
      await api.inventory.adjustStock(
        adjustingStockItem.productId,
        stockAdjustmentQty,
        stockAdjustmentReason,
        `Admin adjusted: ${stockAdjustmentReason}`
      );
      onShowToast(`Inventory adjusted by ${stockAdjustmentQty} units`);
      setAdjustingStockItem(null);
      refreshCurrentSection('inventory');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to adjust stock');
    }
  };

  // Coupon Creation
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.coupons.create({
        code: newCouponCode.trim().toUpperCase(),
        discountType: newCouponType,
        discountValue: Number(newCouponValue),
        minOrderAmount: Number(newCouponMinOrder),
        usageLimit: 200,
        perCustomerLimit: 1,
        isActive: true,
      });
      onShowToast(`Coupon code "${newCouponCode.toUpperCase()}" created`);
      setIsCouponModalOpen(false);
      setNewCouponCode('');
      refreshCurrentSection('coupons');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to create coupon');
    }
  };

  const handleToggleCoupon = async (id: string, currentActive: boolean) => {
    try {
      await api.coupons.update(id, { isActive: !currentActive });
      onShowToast('Coupon status updated');
      refreshCurrentSection('coupons');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update coupon');
    }
  };

  // Homepage CMS Save
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.homepage.update(homepageContent);
      onShowToast('Storefront homepage updated live!');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update homepage');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2D2F] flex flex-col antialiased">
      {/* Top Admin Header Bar */}
      <header className="h-16 bg-[#2B2D2F] text-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md border-b border-[#3D4043]">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger toggle (min 44px touch target) */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle admin navigation"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileNavOpen ? 'close' : 'menu'}
            </span>
          </button>

          <GluckGifyLogo size="icon-only" glow={true} className="w-8 h-8" />
          <div className="flex items-center gap-2">
            <span className="font-serif text-[17px] font-semibold tracking-tight text-white">
              GLÜCK GIFY Atelier
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#4CAF50] text-white shadow-2xs">
              Admin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onReturnToStorefront}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#4CAF50] text-white text-[12.5px] font-medium transition-all cursor-pointer shadow-2xs min-h-[38px]"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span className="hidden sm:inline">View Public Storefront</span>
            <span className="sm:hidden">Store</span>
          </button>

          <div className="h-5 w-px bg-white/20" />

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-[12.5px] font-bold block leading-none text-white">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#A3D9B1] uppercase font-mono">
                {currentUser.role}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Menu for Small Screens */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#2B2D2F]/60 backdrop-blur-xs"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-50">
            <nav className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8D8]">
                <div className="flex items-center gap-2">
                  <GluckGifyLogo size="icon-only" className="w-6 h-6" />
                  <span className="font-bold text-sm text-[#2B2D2F]">Admin Menu</span>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1 rounded-full text-[#7A8276] hover:bg-[#F3F7F2]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Group 1: GLÜCK GIFY Studio & Bespoke Suite */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#4CAF50] px-3 mb-2 flex items-center gap-1.5">
                  <SparkleStarIcon size={12} color="#4CAF50" />
                  <span>Gify Studio &amp; Brand</span>
                </div>
                <div className="space-y-1">
                  {[
                    { id: 'dashboard', label: 'Overview Dashboard', icon: 'dashboard' },
                    { id: 'studio-assets', label: 'Gify Assets Studio', icon: 'local_florist' },
                    { id: 'studio-accessories', label: 'Cute Accessories', icon: 'shopping_bag' },
                    { id: 'custom-requests', label: 'Custom Maker Requests', icon: 'palette' },
                    { id: 'brand-settings', label: 'Brand & Logo Settings', icon: 'settings_suggest' },
                  ].map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id as AdminSection);
                          setMobileNavOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-semibold text-left transition-all cursor-pointer min-h-[44px] ${
                          isActive
                            ? 'bg-[#4CAF50] text-white shadow-xs'
                            : 'text-[#4A5568] hover:bg-[#FAF9F6] hover:text-[#2B2D2F]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: E-Commerce & Inventory Management */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A8276] px-3 mb-2">
                  Storefront &amp; Inventory
                </div>
                <div className="space-y-1">
                  {[
                    { id: 'products', label: 'Products & Crafts', icon: 'inventory_2' },
                    { id: 'orders', label: 'Client Orders', icon: 'local_shipping' },
                    { id: 'inventory', label: 'Stock & Movements', icon: 'warehouse' },
                    { id: 'categories', label: 'Categories & Occasions', icon: 'category' },
                    { id: 'customers', label: 'Customer Accounts', icon: 'groups' },
                    { id: 'coupons', label: 'Coupons & Promos', icon: 'sell' },
                    { id: 'audit', label: 'Security & Audit Logs', icon: 'history_edu' },
                  ].map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id as AdminSection);
                          setMobileNavOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-semibold text-left transition-all cursor-pointer min-h-[44px] ${
                          isActive
                            ? 'bg-[#4CAF50] text-white shadow-xs'
                            : 'text-[#4A5568] hover:bg-[#FAF9F6] hover:text-[#2B2D2F]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>

            <div className="pt-4 border-t border-[#E2E8D8] text-[11px] text-[#7A8276]">
              <div className="flex items-center gap-1.5 font-medium text-[#2D6A4F]">
                <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
                <span>Persistent Database Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Layout: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop & Tablet Sidebar */}
        <aside className="hidden md:flex md:w-60 lg:w-64 bg-white border-r border-[#E2E8D8] p-4 sm:p-5 flex-col justify-between shrink-0 shadow-2xs">
          <nav className="space-y-4">
            {/* Group 1: GLÜCK GIFY Studio & Bespoke Suite */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#4CAF50] px-3 mb-2 flex items-center gap-1.5">
                <SparkleStarIcon size={12} color="#4CAF50" />
                <span>Gify Studio &amp; Brand</span>
              </div>
              <div className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Overview Dashboard', icon: 'dashboard' },
                  { id: 'studio-assets', label: 'Gify Assets Studio', icon: 'local_florist' },
                  { id: 'studio-accessories', label: 'Cute Accessories', icon: 'shopping_bag' },
                  { id: 'custom-requests', label: 'Custom Maker Requests', icon: 'palette' },
                  { id: 'brand-settings', label: 'Brand & Logo Settings', icon: 'settings_suggest' },
                ].map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as AdminSection)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#4CAF50] text-white shadow-xs'
                          : 'text-[#4A5568] hover:bg-[#FAF9F6] hover:text-[#2B2D2F]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group 2: E-Commerce & Inventory Management */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A8276] px-3 mb-2">
                Storefront &amp; Inventory
              </div>
              <div className="space-y-1">
                {[
                  { id: 'products', label: 'Products & Crafts', icon: 'inventory_2' },
                  { id: 'orders', label: 'Client Orders', icon: 'local_shipping' },
                  { id: 'inventory', label: 'Stock & Movements', icon: 'warehouse' },
                  { id: 'categories', label: 'Categories & Occasions', icon: 'category' },
                  { id: 'customers', label: 'Customer Accounts', icon: 'groups' },
                  { id: 'coupons', label: 'Coupons & Promos', icon: 'sell' },
                  { id: 'audit', label: 'Security & Audit Logs', icon: 'history_edu' },
                ].map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as AdminSection)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#4CAF50] text-white shadow-xs'
                          : 'text-[#4A5568] hover:bg-[#FAF9F6] hover:text-[#2B2D2F]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="pt-6 border-t border-[#E2E8D8] mt-6 text-[11px] text-[#7A8276] space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-[#2D6A4F]">
              <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
              <span>Database Persistent &amp; Active</span>
            </div>
            <p className="text-[10.5px]">Timezone: Asia/Colombo (SLST)</p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 mb-6 border-b border-[#E2E8D8]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4CAF50] flex items-center gap-1.5">
                <SparkleStarIcon size={12} color="#4CAF50" />
                <span>GLÜCK GIFY Command Suite</span>
              </span>
              <h1 className="font-serif text-[26px] text-[#2B2D2F] font-bold capitalize mt-0.5">
                {activeSection === 'dashboard'
                  ? 'Overview Dashboard'
                  : activeSection === 'studio-assets'
                  ? 'Gify Assets Studio'
                  : activeSection === 'studio-accessories'
                  ? 'Cute Accessories Management'
                  : activeSection === 'custom-requests'
                  ? 'Order & Custom Maker Requests'
                  : activeSection === 'brand-settings'
                  ? 'Brand Settings & Theme Configuration'
                  : activeSection}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => refreshCurrentSection(activeSection)}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8D8] text-[#2B2D2F] text-[12px] font-bold hover:bg-[#FAF9F6] hover:border-[#4CAF50] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Refresh Live</span>
              </button>
            </div>
          </div>

          {/* GLÜCK GIFY STUDIO & BESPOKE SECTIONS */}

          {/* 1. OVERVIEW DASHBOARD */}
          {activeSection === 'dashboard' && (
            <AdminOverviewDashboard
              summary={summary}
              salesTimeline={salesTimeline}
              topProducts={topProducts}
              recentOrders={recentOrders}
              customRequests={customRequestsList}
              onNavigateSection={(sec) => setActiveSection(sec)}
              onOpenCreateAsset={() => setActiveSection('studio-assets')}
              onOpenCreateAccessory={() => setActiveSection('studio-accessories')}
            />
          )}

          {/* 2. GIFTY ASSETS STUDIO */}
          {activeSection === 'studio-assets' && (
            <AdminGifyAssets
              assets={gifyAssetsList}
              onRefresh={() => refreshCurrentSection('studio-assets')}
              onShowToast={onShowToast}
            />
          )}

          {/* 3. CUTE ACCESSORIES BOUTIQUE */}
          {activeSection === 'studio-accessories' && (
            <AdminCuteAccessories
              accessories={accessoriesList}
              onRefresh={() => refreshCurrentSection('studio-accessories')}
              onShowToast={onShowToast}
            />
          )}

          {/* 4. ORDER & CUSTOM MAKER REQUESTS */}
          {activeSection === 'custom-requests' && (
            <AdminCustomRequests
              requests={customRequestsList}
              onRefresh={() => refreshCurrentSection('custom-requests')}
              onShowToast={onShowToast}
            />
          )}

          {/* 5. BRAND SETTINGS & THEME CONFIGURATION */}
          {activeSection === 'brand-settings' && (
            <AdminBrandSettings onShowToast={onShowToast} />
          )}

          {/* SECTION 2: PRODUCTS (FULL CRUD) */}
          {activeSection === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <span className="material-symbols-outlined text-[18px] text-[#877275] absolute left-3 top-2.5">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#dac0c4]/60 text-[13.5px] focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#7c243f] text-white text-[13px] font-semibold hover:bg-[#5e0b29] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Create New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-[#dac0c4]/40 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#fff0ef] text-[#5e0b29] font-bold border-b border-[#dac0c4]/40">
                      <tr>
                        <th className="p-3.5">Product</th>
                        <th className="p-3.5">SKU</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Price</th>
                        <th className="p-3.5">Stock</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dac0c4]/30">
                      {productsList
                        .filter(
                          (p) =>
                            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                            p.sku.toLowerCase().includes(productSearch.toLowerCase())
                        )
                        .map((product) => (
                          <tr key={product.id} className="hover:bg-[#fff8f7]">
                            <td className="p-3.5 flex items-center gap-3">
                              <img
                                alt={product.name}
                                src={product.image}
                                className="w-12 h-14 object-cover rounded-lg bg-[#fbeae8]"
                              />
                              <div>
                                <span className="font-bold text-[#5e0b29] block">
                                  {product.name}
                                </span>
                                <span className="text-[11px] text-[#877275]">
                                  {product.subtitle || 'Handcrafted keepsake'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-[12px]">{product.sku}</td>
                            <td className="p-3.5 capitalize">{product.category}</td>
                            <td className="p-3.5 font-bold text-[#5e0b29]">
                              LKR {product.price.toLocaleString()}
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  product.stockQuantity <= product.lowStockThreshold
                                    ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                    : 'bg-[#fff0ef] text-[#5e0b29]'
                                }`}
                              >
                                {product.stockQuantity} in stock
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="capitalize px-2 py-0.5 rounded text-[11px] font-bold bg-[#f3dde0] text-[#5e0b29]">
                                {product.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1 text-[#544245] hover:text-[#5e0b29] cursor-pointer"
                                title="Edit"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  edit
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteProduct(product.id, product.name)
                                }
                                className="p-1 text-[#877275] hover:text-[#ba1a1a] cursor-pointer"
                                title="Archive"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  archive
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: CATEGORIES & OCCASIONS */}
          {activeSection === 'categories' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categories */}
                <div className="bg-white p-5 rounded-2xl border border-[#dac0c4]/40 shadow-xs">
                  <h3 className="font-editorial text-[18px] text-[#5e0b29] font-semibold mb-4">
                    Curated Categories ({categoriesList.length})
                  </h3>
                  <div className="space-y-3">
                    {categoriesList.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-3 rounded-xl bg-[#fff8f7] border border-[#dac0c4]/30 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            alt={cat.name}
                            src={cat.image}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-[13.5px] text-[#5e0b29]">
                              {cat.name}
                            </span>
                            {cat.badge && (
                              <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-[#7c243f] text-white">
                                {cat.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[12px] text-[#877275]">
                          Order: {cat.displayOrder}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Occasions */}
                <div className="bg-white p-5 rounded-2xl border border-[#dac0c4]/40 shadow-xs">
                  <h3 className="font-editorial text-[18px] text-[#5e0b29] font-semibold mb-4">
                    Occasion Collections ({occasionsList.length})
                  </h3>
                  <div className="space-y-3">
                    {occasionsList.map((occ) => (
                      <div
                        key={occ.id}
                        className="p-3 rounded-xl bg-[#fff8f7] border border-[#dac0c4]/30 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            alt={occ.title}
                            src={occ.image}
                            className="w-12 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-bold text-[13.5px] text-[#5e0b29]">
                              {occ.title}
                            </span>
                            <span className="text-[11px] text-[#877275] block">
                              {occ.tagline}
                            </span>
                          </div>
                        </div>
                        <span className="text-[12px] text-[#877275]">
                          Active: {occ.isActive ? 'Yes' : 'No'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: ORDERS */}
          {activeSection === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Search by order #, client name, phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-white border border-[#dac0c4]/60 text-[13.5px] focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                />

                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#544245]">Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#dac0c4]/60 text-[12.5px] focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#dac0c4]/40 shadow-xs overflow-hidden">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[#fff0ef] text-[#5e0b29] font-bold border-b border-[#dac0c4]/40">
                    <tr>
                      <th className="p-3.5">Order Ref</th>
                      <th className="p-3.5">Client &amp; Destination</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Fulfillment</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dac0c4]/30">
                    {ordersList.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#fff8f7]">
                        <td className="p-3.5">
                          <span className="font-bold text-[#5e0b29] block">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-[#877275]">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold block">{ord.customerName}</span>
                          <span className="text-[11px] text-[#544245]">
                            {ord.deliveryAddress.district}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {ord.items.length} item(s)
                          {ord.items[0]?.personalization && (
                            <span className="block text-[10.5px] text-[#904858]">
                              ✍️ Inscribed Calligraphy
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-bold text-[#5e0b29]">
                          LKR {ord.total.toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                              ord.paymentStatus === 'paid'
                                ? 'bg-[#d6f5d6] text-[#0f5132]'
                                : 'bg-[#fff0ef] text-[#5e0b29]'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#f3dde0] text-[#5e0b29] uppercase">
                            {ord.fulfillmentStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1 rounded-full bg-[#7c243f] text-white text-[12px] font-semibold hover:bg-[#5e0b29] cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 5: INVENTORY */}
          {activeSection === 'inventory' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#dac0c4]/40 shadow-xs overflow-hidden">
                <div className="p-4 bg-[#fff0ef] border-b border-[#dac0c4]/40 flex items-center justify-between">
                  <h3 className="font-editorial text-[17px] text-[#5e0b29] font-semibold">
                    Live Stock Inventory
                  </h3>
                  <span className="text-[12px] font-bold text-[#904858]">
                    Threshold Alert: &le; 5 units
                  </span>
                </div>
                <table className="w-full text-left text-[13px]">
                  <thead className="text-[#544245] font-bold border-b border-[#dac0c4]/30">
                    <tr>
                      <th className="p-3.5">Craft</th>
                      <th className="p-3.5">SKU</th>
                      <th className="p-3.5">Current Stock</th>
                      <th className="p-3.5">Stock Status</th>
                      <th className="p-3.5 text-right">Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dac0c4]/30">
                    {inventoryList.map((item) => (
                      <tr key={item.productId} className="hover:bg-[#fff8f7]">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            alt={item.name}
                            src={item.image}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="font-bold text-[#5e0b29]">{item.name}</span>
                        </td>
                        <td className="p-3.5 font-mono text-[12px]">{item.sku}</td>
                        <td className="p-3.5 font-bold text-[14px]">
                          {item.stockQuantity} units
                        </td>
                        <td className="p-3.5">
                          {item.isOutOfStock ? (
                            <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
                              Out of Stock
                            </span>
                          ) : item.isLowStock ? (
                            <span className="px-2 py-0.5 rounded bg-[#ffd9df] text-[#5e0b29] text-[11px] font-bold">
                              Low Stock Warning
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-[#e8f5e9] text-[#2e7d32] text-[11px] font-bold">
                              Adequate Stock
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setAdjustingStockItem(item)}
                            className="px-3 py-1 rounded-full bg-[#fbeae8] text-[#5e0b29] text-[11.5px] font-bold hover:bg-[#ffd9df]"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 6: CUSTOMERS */}
          {activeSection === 'customers' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search registered clients..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-white border border-[#dac0c4]/60 text-[13.5px] focus:outline-none"
              />

              <div className="bg-white rounded-2xl border border-[#dac0c4]/40 shadow-xs overflow-hidden">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[#fff0ef] text-[#5e0b29] font-bold border-b border-[#dac0c4]/40">
                    <tr>
                      <th className="p-3.5">Client Name</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Phone</th>
                      <th className="p-3.5">Orders</th>
                      <th className="p-3.5">Total Spent</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dac0c4]/30">
                    {customersList.map((c) => (
                      <tr key={c.id} className="hover:bg-[#fff8f7]">
                        <td className="p-3.5 font-bold text-[#5e0b29]">{c.name}</td>
                        <td className="p-3.5">{c.email}</td>
                        <td className="p-3.5 text-[#544245]">{c.phone || 'N/A'}</td>
                        <td className="p-3.5 font-semibold">{c.orderCount} orders</td>
                        <td className="p-3.5 font-bold text-[#5e0b29]">
                          LKR {c.totalSpent.toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#e8f5e9] text-[#2e7d32] uppercase">
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 7: COUPONS & PROMOTIONS */}
          {activeSection === 'coupons' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-editorial text-[18px] text-[#5e0b29] font-semibold">
                  Promotional Coupons
                </h3>
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="px-5 py-2 rounded-full bg-[#7c243f] text-white text-[13px] font-semibold hover:bg-[#5e0b29] flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {couponsList.map((cpn) => (
                  <div
                    key={cpn.id}
                    className="p-5 rounded-2xl bg-white border border-[#dac0c4]/40 shadow-xs relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[16px] font-bold text-[#5e0b29] bg-[#fff0ef] px-2.5 py-1 rounded-lg">
                        {cpn.code}
                      </span>
                      <button
                        onClick={() => handleToggleCoupon(cpn.id, cpn.isActive)}
                        className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase cursor-pointer ${
                          cpn.isActive
                            ? 'bg-[#d6f5d6] text-[#0f5132]'
                            : 'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}
                      >
                        {cpn.isActive ? 'Active' : 'Deactivated'}
                      </button>
                    </div>

                    <div className="text-[14px] font-bold text-[#221a19] mt-2">
                      {cpn.discountType === 'percentage'
                        ? `${cpn.discountValue}% OFF`
                        : `LKR ${cpn.discountValue.toLocaleString()} OFF`}
                    </div>

                    <p className="text-[12px] text-[#544245] mt-1">
                      Min Order: LKR {cpn.minOrderAmount.toLocaleString()} • Redemptions: {cpn.usageCount} / {cpn.usageLimit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: HOMEPAGE CMS */}
          {activeSection === 'homepage' && homepageContent && (
            <form onSubmit={handleSaveHomepage} className="space-y-6 max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-[#dac0c4]/40 shadow-xs">
              <h3 className="font-editorial text-[20px] text-[#5e0b29] font-semibold">
                Storefront Banner &amp; Editorial Content
              </h3>

              <div>
                <label className="block text-[12.5px] font-bold text-[#5e0b29] mb-1">
                  Top Announcement Message
                </label>
                <input
                  type="text"
                  value={homepageContent.announcementText || ''}
                  onChange={(e) =>
                    setHomepageContent({ ...homepageContent, announcementText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#fff8f7] border border-[#dac0c4]/60 text-[13.5px] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12.5px] font-bold text-[#5e0b29] mb-1">
                    Featured Promo Code
                  </label>
                  <input
                    type="text"
                    value={homepageContent.promoCode || ''}
                    onChange={(e) =>
                      setHomepageContent({ ...homepageContent, promoCode: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#fff8f7] border border-[#dac0c4]/60 text-[13.5px] uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-bold text-[#5e0b29] mb-1">
                    Promo Discount %
                  </label>
                  <input
                    type="number"
                    value={homepageContent.promoDiscountPercent || 10}
                    onChange={(e) =>
                      setHomepageContent({
                        ...homepageContent,
                        promoDiscountPercent: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#fff8f7] border border-[#dac0c4]/60 text-[13.5px] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-[#5e0b29] mb-1">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={homepageContent.heroHeadline || ''}
                  onChange={(e) =>
                    setHomepageContent({ ...homepageContent, heroHeadline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#fff8f7] border border-[#dac0c4]/60 text-[13.5px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-[#5e0b29] mb-1">
                  Hero Supporting Description
                </label>
                <textarea
                  rows={3}
                  value={homepageContent.heroDescription || ''}
                  onChange={(e) =>
                    setHomepageContent({ ...homepageContent, heroDescription: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-[#fff8f7] border border-[#dac0c4]/60 text-[13.5px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-[#5e0b29] mb-1">
                  Complimentary Calligraphy Note Badge
                </label>
                <input
                  type="text"
                  value={homepageContent.complimentaryDetailNote || ''}
                  onChange={(e) =>
                    setHomepageContent({
                      ...homepageContent,
                      complimentaryDetailNote: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#fff8f7] border border-[#dac0c4]/60 text-[13.5px] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-[#7c243f] text-white text-[13.5px] font-semibold hover:bg-[#5e0b29] shadow-sm cursor-pointer"
              >
                Publish Changes Live
              </button>
            </form>
          )}

          {/* SECTION 9: AUDIT LOGS */}
          {activeSection === 'audit' && (
            <div className="bg-white rounded-2xl border border-[#dac0c4]/40 shadow-xs overflow-hidden">
              <div className="p-4 bg-[#fff0ef] border-b border-[#dac0c4]/40">
                <h3 className="font-editorial text-[17px] text-[#5e0b29] font-semibold">
                  Administrative Audit Trail ({auditLogsList.length})
                </h3>
              </div>
              <table className="w-full text-left text-[12.5px]">
                <thead className="bg-[#fff8f7] text-[#544245] font-bold border-b border-[#dac0c4]/30">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Admin Email</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Resource</th>
                    <th className="p-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dac0c4]/30">
                  {auditLogsList.map((log) => (
                    <tr key={log.id} className="hover:bg-[#fff8f7]">
                      <td className="p-3.5 text-[#877275] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-bold text-[#5e0b29]">{log.adminEmail}</td>
                      <td className="p-3.5 font-mono">{log.action}</td>
                      <td className="p-3.5 uppercase text-[11px]">{log.resource}</td>
                      <td className="p-3.5 text-[#544245] max-w-xs truncate">
                        {JSON.stringify(log.details || {})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: PRODUCT CREATE / EDIT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#382e2d]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fff8f7] max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative border border-[#dac0c4]/60 my-6">
            <h3 className="font-editorial text-[22px] text-[#5e0b29] font-semibold mb-4">
              {editingProduct ? 'Edit Handcrafted Product' : 'Create New Keepsake'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-[13px]">
              <div>
                <label className="block font-bold text-[#5e0b29] mb-1">Product Title</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingProduct?.name || ''}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5e0b29] mb-1">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    required
                    defaultValue={editingProduct?.sku || `GFT-${Math.floor(1000 + Math.random() * 9000)}`}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5e0b29] mb-1">Price in LKR</label>
                  <input
                    type="number"
                    name="price"
                    required
                    defaultValue={editingProduct?.price || 3500}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5e0b29] mb-1">Editorial Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  defaultValue={editingProduct?.subtitle || 'Ceylon handcrafted keepsake'}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5e0b29] mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  required
                  defaultValue={editingProduct?.description || ''}
                  className="w-full p-3 rounded-lg bg-white border border-[#dac0c4]/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5e0b29] mb-1">Image URL</label>
                <input
                  type="url"
                  name="image"
                  required
                  defaultValue={editingProduct?.image || '/logo.png'}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#5e0b29] mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'gift-hampers'}
                    className="w-full px-2 py-2 rounded-lg bg-white border border-[#dac0c4]/60 focus:outline-none"
                  >
                    <option value="gift-hampers">Gift Hampers</option>
                    <option value="personalized">Personalized</option>
                    <option value="fresh-florals">Fresh Florals</option>
                    <option value="home-living">Home &amp; Living</option>
                    <option value="gourmet">Gourmet</option>
                    <option value="for-him">For Him</option>
                    <option value="for-her">For Her</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#5e0b29] mb-1">Primary Occasion</label>
                  <select
                    name="occasion"
                    defaultValue={editingProduct?.occasion?.[0] || 'birthday'}
                    className="w-full px-2 py-2 rounded-lg bg-white border border-[#dac0c4]/60 focus:outline-none"
                  >
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="wedding">Wedding</option>
                    <option value="thank-you">Thank You</option>
                    <option value="just-because">Just Because</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#5e0b29] mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    required
                    defaultValue={editingProduct?.stockQuantity || 20}
                    className="w-full px-2 py-2 rounded-lg bg-white border border-[#dac0c4]/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPersonalizable"
                    defaultChecked={editingProduct?.isPersonalizable ?? true}
                  />
                  <span>Personalizable (Engraving / Calligraphy)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="giftWrappingAvailable"
                    defaultChecked={editingProduct?.giftWrappingAvailable ?? true}
                  />
                  <span>Gift Wrapping Available</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#fbeae8]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2 rounded-full text-[#544245] hover:bg-[#fbeae8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#7c243f] text-white font-semibold hover:bg-[#5e0b29]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS & STATUS UPDATE */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#382e2d]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fff8f7] max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative border border-[#dac0c4]/60 my-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#fbeae8]">
              <div>
                <span className="text-[11px] font-bold text-[#904858] uppercase">
                  Order Management
                </span>
                <h3 className="font-editorial text-[22px] text-[#5e0b29] font-semibold">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-[#fbeae8] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-4 text-[13px]">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white border border-[#dac0c4]/40">
                <div>
                  <span className="font-bold text-[#5e0b29] block">Recipient Details</span>
                  <p>{selectedOrder.deliveryAddress.recipientName}</p>
                  <p>{selectedOrder.deliveryAddress.street}</p>
                  <p>{selectedOrder.deliveryAddress.district}</p>
                  <p className="text-[#877275]">Tel: {selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <span className="font-bold text-[#5e0b29] block">Financial Summary</span>
                  <p>Subtotal: LKR {selectedOrder.subtotal.toLocaleString()}</p>
                  {selectedOrder.discount > 0 && (
                    <p className="text-[#5e0b29]">Discount: - LKR {selectedOrder.discount.toLocaleString()}</p>
                  )}
                  <p>Delivery: LKR {selectedOrder.deliveryFee.toLocaleString()}</p>
                  <p className="font-bold text-[15px] text-[#5e0b29] mt-1">
                    Total: LKR {selectedOrder.total.toLocaleString()}
                  </p>
                  <span className="text-[11px] uppercase font-bold text-[#2e7d32]">
                    Status: {selectedOrder.paymentStatus} via {selectedOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <span className="font-bold text-[#5e0b29] block mb-2">Purchased Keepsakes:</span>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-white border border-[#dac0c4]/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          alt={item.name}
                          src={item.image}
                          className="w-10 h-12 object-cover rounded bg-[#fbeae8]"
                        />
                        <div>
                          <span className="font-bold block">{item.name}</span>
                          <span className="text-[11px] text-[#877275]">
                            Qty: {item.quantity} • LKR {item.unitPrice.toLocaleString()} each
                          </span>
                          {item.personalization && (
                            <span className="text-[11px] text-[#904858] block">
                              Calligraphy Note: "{item.personalization.message}" ({item.personalization.waxSealColor})
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-bold">
                        LKR {(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="pt-3 border-t border-[#fbeae8]">
                <span className="font-bold text-[#5e0b29] block mb-2">
                  Update Fulfillment Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'].map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-bold capitalize cursor-pointer ${
                          selectedOrder.fulfillmentStatus === st
                            ? 'bg-[#5e0b29] text-white'
                            : 'bg-[#fff0ef] text-[#5e0b29] hover:bg-[#fbeae8]'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Courier Tracking */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Assign tracking code (e.g. GF-EXP-88421)"
                  defaultValue={selectedOrder.trackingNumber || ''}
                  id="trackingInput"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#dac0c4]/60 text-[12.5px] uppercase"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('trackingInput') as HTMLInputElement;
                    if (input) handleUpdateTracking(selectedOrder.id, input.value);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#7c243f] text-white text-[12px] font-bold hover:bg-[#5e0b29]"
                >
                  Save Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INVENTORY ADJUSTMENT */}
      {adjustingStockItem && (
        <div className="fixed inset-0 z-50 bg-[#382e2d]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fff8f7] max-w-md w-full rounded-2xl p-6 shadow-2xl border border-[#dac0c4]/60">
            <h3 className="font-editorial text-[20px] text-[#5e0b29] font-semibold mb-2">
              Adjust Stock: {adjustingStockItem.name}
            </h3>
            <p className="text-[12.5px] text-[#544245] mb-4">
              Current inventory balance: <span className="font-bold">{adjustingStockItem.stockQuantity}</span> units.
            </p>

            <form onSubmit={handleStockAdjustment} className="space-y-3 text-[13px]">
              <div>
                <label className="block font-bold text-[#5e0b29] mb-1">
                  Quantity Adjustment (+ or -)
                </label>
                <input
                  type="number"
                  value={stockAdjustmentQty}
                  onChange={(e) => setStockAdjustmentQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5e0b29] mb-1">Adjustment Reason</label>
                <select
                  value={stockAdjustmentReason}
                  onChange={(e) => setStockAdjustmentReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60"
                >
                  <option value="restock">Artisan Workshop Restock</option>
                  <option value="manual_adjustment">Physical Count Audit</option>
                  <option value="damage">Showroom Sample / Transit Damage</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAdjustingStockItem(null)}
                  className="px-4 py-2 rounded-full text-[#544245]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#7c243f] text-white font-bold hover:bg-[#5e0b29]"
                >
                  Record Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COUPON CREATE */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#382e2d]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fff8f7] max-w-md w-full rounded-2xl p-6 shadow-2xl border border-[#dac0c4]/60">
            <h3 className="font-editorial text-[20px] text-[#5e0b29] font-semibold mb-4">
              Create Promotional Coupon
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-[13px]">
              <div>
                <label className="block font-bold text-[#5e0b29] mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SPRINGLOVE"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5e0b29] mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed LKR Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#5e0b29] mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5e0b29] mb-1">
                  Minimum Order Amount (LKR)
                </label>
                <input
                  type="number"
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-full text-[#544245]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#7c243f] text-white font-bold hover:bg-[#5e0b29]"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
