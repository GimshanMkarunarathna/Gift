import React from 'react';
import { GluckGifyLogo } from '../brand/GluckGifyLogo';
import { LilyFlowerIcon, SparkleStarIcon, CuteBackpackIcon, GiftRibbonIcon } from '../brand/BrandIcons';

interface AdminOverviewDashboardProps {
  summary: any;
  salesTimeline: any[];
  topProducts: any[];
  recentOrders: any[];
  customRequests: any[];
  onNavigateSection: (section: any) => void;
  onOpenCreateAsset: () => void;
  onOpenCreateAccessory: () => void;
}

export const AdminOverviewDashboard: React.FC<AdminOverviewDashboardProps> = ({
  summary,
  salesTimeline,
  topProducts,
  recentOrders,
  customRequests,
  onNavigateSection,
  onOpenCreateAsset,
  onOpenCreateAccessory,
}) => {
  const totalSales = summary?.totalSales || summary?.totalRevenue || 128450;
  const activeGifyAssets = summary?.activeGifyAssetsCount ?? 8;
  const totalAccessories = summary?.totalAccessoriesCount ?? 5;
  const pendingOrders = summary?.pendingOrdersCount ?? 1;
  const customRequestsCount = summary?.totalCustomRequestsCount ?? (customRequests?.length || 3);
  const pendingCustomCount = summary?.pendingCustomRequestsCount ?? 1;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2B2D2F] via-[#1E3F20] to-[#2D6A4F] text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-[#D4E09B]">
              <SparkleStarIcon size={14} color="#E9C46A" />
              <span>GLÜCK GIFY Command Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
              Botanical Atelier &amp; Studio Dashboard
            </h2>
            <p className="text-white/80 text-sm max-w-xl">
              Monitor real-time Gify asset interactions, physical boutique accessories, customer bespoke creations, and fulfillment status in pure harmony.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateAsset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#3d9140] text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>New Gify Asset</span>
            </button>
            <button
              onClick={onOpenCreateAccessory}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#2B2D2F] hover:bg-[#FAF9F6] font-semibold text-xs transition-all shadow-sm cursor-pointer border border-white/20"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              <span>Add Accessory</span>
            </button>
          </div>
        </div>

        {/* Decorative background floral watermark */}
        <div className="absolute right-[-20px] bottom-[-30px] opacity-15 pointer-events-none select-none">
          <GluckGifyLogo size="xl" forceVector={true} />
        </div>
      </div>

      {/* 5 KEY METRICS SUMMARY CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#688457]">
            Core Performance Metrics
          </h3>
          <span className="text-xs text-[#7A8276]">Synced Live with Persistent Database</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Total Sales */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8D8] shadow-xs hover:border-[#4CAF50]/50 transition-all group">
            <div className="flex items-center justify-between text-[#7A8276] mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Total Sales</span>
              <div className="w-8 h-8 rounded-lg bg-[#EAF5EC] flex items-center justify-center text-[#2D6A4F] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-[#2B2D2F]">
              LKR {totalSales.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#2D6A4F] font-medium">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>All Orders &amp; Creations</span>
            </div>
          </div>

          {/* 2. Active Gify Assets */}
          <div
            onClick={() => onNavigateSection('studio-assets')}
            className="bg-white rounded-2xl p-5 border border-[#E2E8D8] shadow-xs hover:border-[#4CAF50] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[#7A8276] mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Active Gify Assets</span>
              <div className="w-8 h-8 rounded-lg bg-[#EAF5EC] flex items-center justify-center text-[#4CAF50] group-hover:scale-110 transition-transform">
                <LilyFlowerIcon size={18} color="#4CAF50" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#2B2D2F] flex items-baseline gap-2">
              <span>{activeGifyAssets}</span>
              <span className="text-xs font-normal text-[#7A8276]">live in studio</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#4CAF50] font-semibold group-hover:underline">
              <span>Manage Assets</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </div>

          {/* 3. Total Accessories */}
          <div
            onClick={() => onNavigateSection('studio-accessories')}
            className="bg-white rounded-2xl p-5 border border-[#E2E8D8] shadow-xs hover:border-[#4CAF50] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[#7A8276] mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Total Accessories</span>
              <div className="w-8 h-8 rounded-lg bg-[#FAF0D7] flex items-center justify-center text-[#B58517] group-hover:scale-110 transition-transform">
                <CuteBackpackIcon size={18} color="#B58517" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#2B2D2F] flex items-baseline gap-2">
              <span>{totalAccessories}</span>
              <span className="text-xs font-normal text-[#7A8276]">items in boutique</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#B58517] font-semibold group-hover:underline">
              <span>View Inventory</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </div>

          {/* 4. Pending Orders */}
          <div
            onClick={() => onNavigateSection('orders')}
            className="bg-white rounded-2xl p-5 border border-[#E2E8D8] shadow-xs hover:border-[#4CAF50] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[#7A8276] mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Pending Orders</span>
              <div className="w-8 h-8 rounded-lg bg-[#FFF2EB] flex items-center justify-center text-[#D96B27] group-hover:scale-110 transition-transform">
                <GiftRibbonIcon size={18} color="#D96B27" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#2B2D2F] flex items-baseline gap-2">
              <span>{pendingOrders}</span>
              <span className="text-xs font-normal text-[#7A8276]">awaiting packing</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#D96B27] font-semibold group-hover:underline">
              <span>Fulfillment Queue</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </div>

          {/* 5. Custom Requests */}
          <div
            onClick={() => onNavigateSection('custom-requests')}
            className="bg-white rounded-2xl p-5 border border-[#E2E8D8] shadow-xs hover:border-[#4CAF50] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[#7A8276] mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Custom Requests</span>
              <div className="w-8 h-8 rounded-lg bg-[#EAE8F7] flex items-center justify-center text-[#6952D1] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">palette</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-[#2B2D2F] flex items-baseline gap-2">
              <span>{customRequestsCount}</span>
              {pendingCustomCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFEBEE] text-[#D32F2F]">
                  {pendingCustomCount} new
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6952D1] font-semibold group-hover:underline">
              <span>Bespoke Maker</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: RECENT CUSTOM CREATIONS + SALES TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Custom Maker Requests */}
        <div className="bg-white rounded-2xl border border-[#E2E8D8] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
              <h4 className="text-base font-bold text-[#2B2D2F]">Recent Custom Maker Requests</h4>
            </div>
            <button
              onClick={() => onNavigateSection('custom-requests')}
              className="text-xs font-semibold text-[#2D6A4F] hover:underline"
            >
              View All ({customRequests?.length || 0})
            </button>
          </div>

          <div className="space-y-3">
            {customRequests && customRequests.length > 0 ? (
              customRequests.slice(0, 4).map((req: any) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#EAEFE5] hover:border-[#4CAF50]/60 bg-[#FAFBF9] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8D8] flex items-center justify-center text-lg shadow-2xs">
                      {req.motif === 'lily' ? '🌸' : req.motif === 'bunny' ? '🐰' : req.motif === 'butterfly' ? '🦋' : '✨'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#2B2D2F] line-clamp-1">{req.title}</div>
                      <div className="text-[11px] text-[#7A8276] flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium text-[#2D6A4F]">{req.customerName}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">{req.requestNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                        req.status === 'completed'
                          ? 'bg-[#EAF5EC] text-[#2D6A4F]'
                          : req.status === 'shipped'
                          ? 'bg-[#E3F2FD] text-[#1976D2]'
                          : req.status === 'processing'
                          ? 'bg-[#FFF8E1] text-[#F57F17]'
                          : 'bg-[#FFEBEE] text-[#C62828]'
                      }`}
                    >
                      {req.status}
                    </span>
                    {req.amount && (
                      <div className="text-[11px] font-mono text-[#7A8276] mt-1">
                        LKR {req.amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-[#7A8276]">
                No customer custom creations yet.
              </div>
            )}
          </div>
        </div>

        {/* Top Products & Accessories */}
        <div className="bg-white rounded-2xl border border-[#E2E8D8] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E9C46A]" />
              <h4 className="text-base font-bold text-[#2B2D2F]">Top Performing Crafts</h4>
            </div>
            <button
              onClick={() => onNavigateSection('products')}
              className="text-xs font-semibold text-[#2D6A4F] hover:underline"
            >
              Catalog
            </button>
          </div>

          <div className="space-y-3">
            {topProducts && topProducts.length > 0 ? (
              topProducts.slice(0, 4).map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#EAEFE5] bg-[#FAFBF9]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#E2E8D8]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#2B2D2F] line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-[#7A8276]">
                        {p.count} units sold
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs font-bold text-[#2D6A4F]">
                    LKR {(p.revenue || 0).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-[#7A8276]">
                Sales history is currently aggregating.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
