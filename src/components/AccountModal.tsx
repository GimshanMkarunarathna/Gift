import React, { useState, useEffect } from 'react';
import { User, api } from '../services/api';
import { USER_AVATAR } from '../data/mockData';
import { GluckGifyLogo } from './brand/GluckGifyLogo';
import { LilyFlowerIcon, SparkleStarIcon, CuteBackpackIcon } from './brand/BrandIcons';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenTrackOrder: () => void;
  onOpenStudio?: () => void;
  onOpenAuthModal?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onOpenTrackOrder,
  onOpenStudio,
  onOpenAuthModal,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'gifys'>('profile');
  const [customGifys, setCustomGifys] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadSavedGifys();
    }
  }, [isOpen]);

  const loadSavedGifys = async () => {
    try {
      const res = await api.customRequests.getAll();
      if (res.requests && res.requests.length > 0) {
        setCustomGifys(res.requests);
      } else {
        // Fallback default saved creations
        setCustomGifys([
          {
            id: 'req-201',
            title: 'Blossoming Meadow Wish',
            motif: 'Unfurling Lily',
            caption: 'May happiness bloom in your heart always ✨',
            colorTheme: 'Lily Green (#4CAF50)',
            status: 'completed',
            createdAt: '2026-04-12',
          },
          {
            id: 'req-202',
            title: 'Bunny & Spring Tea Party',
            motif: 'Dancing Meadow Bunny',
            caption: 'To my dearest Ruwini, happy birthday!',
            colorTheme: 'Soft Blossom Pink (#FFA5B7)',
            status: 'processing',
            createdAt: '2026-04-14',
          },
        ]);
      }
    } catch {
      setCustomGifys([
        {
          id: 'req-201',
          title: 'Blossoming Meadow Wish',
          motif: 'Unfurling Lily',
          caption: 'May happiness bloom in your heart always ✨',
          colorTheme: 'Lily Green (#4CAF50)',
          status: 'completed',
          createdAt: '2026-04-12',
        },
      ]);
    }
  };

  if (!isOpen) return null;

  const displayName = currentUser?.name || 'Udara Fernando';
  const displayEmail = currentUser?.email || 'udara.fernando@giftora.lk';
  const displayAvatar = currentUser?.avatarUrl || USER_AVATAR;
  const displayTier = currentUser?.tier || 'VIP Keepsake Member';

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2D2F]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF9F6] max-w-xl w-full rounded-2xl p-5 sm:p-7 shadow-2xl relative border border-[#E2E8D8] my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E8D8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAF5EC] flex items-center justify-center text-[#2D6A4F]">
              <LilyFlowerIcon size={18} accentColor="#4CAF50" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-[#2B2D2F] leading-tight">
                My Keepsakes &amp; Account
              </h3>
              <p className="text-[11px] text-[#7A8276]">Personal Atelier Profile &amp; Collection</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Account Modal"
            className="w-8 h-8 rounded-full bg-white hover:bg-[#F3F7F2] text-[#2B2D2F] border border-[#DEE5D9] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-4 rounded-xl bg-white border border-[#E2E8D8] mb-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <img
              alt={displayName}
              src={displayAvatar}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#4CAF50] shadow-2xs"
            />
            <div className="text-center sm:text-left">
              <h4 className="text-base font-bold text-[#2B2D2F] leading-snug">
                {displayName}
              </h4>
              <p className="text-xs text-[#7A8276]">{displayEmail}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5 justify-center sm:justify-start">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5EC] text-[#2D6A4F] text-[10.5px] font-bold">
                  {displayTier}
                </span>
                <span className="text-[11px] text-[#7A8276]">• 4 Keepsake Orders</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E2E8D8] mb-4 bg-white rounded-xl p-1 border">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#4CAF50] text-white shadow-xs'
                : 'text-[#556353] hover:text-[#2B2D2F]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">celebration</span>
            <span>Reminders</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#4CAF50] text-white shadow-xs'
                : 'text-[#556353] hover:text-[#2B2D2F]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
            <span>Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('gifys')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'gifys'
                ? 'bg-[#4CAF50] text-white shadow-xs'
                : 'text-[#556353] hover:text-[#2B2D2F]'
            }`}
          >
            <SparkleStarIcon size={14} color={activeTab === 'gifys' ? '#FFFFFF' : '#E9C46A'} />
            <span>Saved Gifys</span>
          </button>
        </div>

        {/* Tab 1: Profile & Celebration Reminders */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#556353] uppercase tracking-wider">
                Upcoming Celebration Reminders
              </span>
              <span className="font-bold text-[#2D6A4F] bg-[#EAF5EC] px-2 py-0.5 rounded-full">
                3 Active
              </span>
            </div>

            <div className="space-y-2">
              {[
                { name: "Ruwini's Birthday", date: 'November 24', daysLeft: 'in 42 days', icon: 'cake' },
                { name: 'Wedding Anniversary', date: 'February 14', daysLeft: 'in 124 days', icon: 'favorite' },
                { name: "Amma's Day", date: 'May 10', daysLeft: 'Annual reminder', icon: 'local_florist' },
              ].map((rem, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2E8D8] text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#4CAF50] text-[20px]">
                      {rem.icon}
                    </span>
                    <span className="font-bold text-[#2B2D2F]">{rem.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#7A8276] block font-medium">{rem.date}</span>
                    <span className="text-[10px] text-[#2D6A4F] font-bold">
                      {rem.daysLeft}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-[#F0F7F2] border border-[#D5E5D8] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#2D6A4F] font-semibold">
                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                <span>Automatic 7-day reminder emails enabled</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenStudio) onOpenStudio();
                }}
                className="text-xs font-bold text-[#4CAF50] hover:underline cursor-pointer"
              >
                Send Gify
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Orders & Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#556353] uppercase tracking-wider">
                Recent Keepsakes &amp; Boutique Orders
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenTrackOrder();
                }}
                className="text-[#2D6A4F] font-bold hover:underline cursor-pointer"
              >
                Track by ID →
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {[
                {
                  id: 'GF-88421',
                  name: 'Good Vibes Botanical Gift Box',
                  date: 'Oct 10, 2026',
                  status: 'Delivered',
                  statusColor: 'bg-green-100 text-green-800',
                  total: 'LKR 8,450',
                },
                {
                  id: 'GF-77290',
                  name: 'Signature Lily Keepsake Ribbon Box',
                  date: 'Sep 28, 2026',
                  status: 'Delivered',
                  statusColor: 'bg-green-100 text-green-800',
                  total: 'LKR 6,200',
                },
                {
                  id: 'GF-90145',
                  name: 'Custom Unfurling Lily Gify + Velvet Box',
                  date: 'Today',
                  status: 'Processing',
                  statusColor: 'bg-amber-100 text-amber-800',
                  total: 'LKR 4,700',
                },
              ].map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2E8D8] text-xs shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2B2D2F]">{order.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7A8276] block mt-0.5">
                      Order {order.id} • {order.date}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-[#2B2D2F] block">{order.total}</span>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenTrackOrder();
                      }}
                      className="mt-1 px-2.5 py-0.5 rounded-full bg-[#EAF5EC] text-[#2D6A4F] text-[10px] font-bold hover:bg-[#D8ECD8] cursor-pointer"
                    >
                      Track
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Saved Custom Gifys */}
        {activeTab === 'gifys' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#556353] uppercase tracking-wider">
                My Saved Custom Creations
              </span>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenStudio) onOpenStudio();
                }}
                className="text-[#2D6A4F] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>+ Make New</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {customGifys.map((gify) => (
                <div
                  key={gify.id}
                  className="p-3 rounded-xl bg-white border border-[#E2E8D8] text-xs shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#EAF5EC] border border-[#C5DEC8] flex items-center justify-center text-[18px]">
                      🌸
                    </div>
                    <div>
                      <h5 className="font-bold text-[#2B2D2F]">{gify.title}</h5>
                      <p className="text-[11px] text-[#7A8276] italic line-clamp-1">
                        "{gify.caption}"
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#2D6A4F] font-semibold">
                          Motif: {gify.motif}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold capitalize">
                          {gify.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenStudio) onOpenStudio();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#DEE5D9] hover:bg-[#EAF5EC] text-[#2D6A4F] font-bold text-xs cursor-pointer shrink-0"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
