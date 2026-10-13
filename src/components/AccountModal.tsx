import React from 'react';
import { USER_AVATAR } from '../data/mockData';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTrackOrder: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onOpenTrackOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#382e2d]/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fff8f7] max-w-lg w-full rounded-2xl p-6 sm:p-7 shadow-2xl relative border border-[#dac0c4]/50">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#fbeae8]">
          <h3 className="font-editorial text-[20px] text-[#5e0b29] font-semibold">
            My Keepsakes &amp; Account
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#fbeae8] text-[#544245] flex items-center justify-center hover:bg-[#f0dfdd] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#fff0ef] border border-[#dac0c4]/30 mb-5">
          <img
            alt="Profile Avatar"
            src={USER_AVATAR}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#5e0b29]"
          />
          <div>
            <h4 className="font-editorial text-[17px] text-[#5e0b29] font-semibold">
              Udara Fernando
            </h4>
            <p className="text-[12px] text-[#544245]">
              Member of the Giftora Circle since 2024
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#f3dde0] text-[#5e0b29] text-[10.5px] font-bold">
              VIP Gifter • 4 Handcrafted Orders
            </span>
          </div>
        </div>

        {/* Milestone Reminders */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#904858] uppercase tracking-wider">
              Upcoming Celebration Reminders
            </span>
            <span className="text-[11px] text-[#5e0b29] font-bold">3 Active</span>
          </div>

          <div className="space-y-2">
            {[
              { name: "Ruwini's Birthday", date: 'November 24', daysLeft: 'in 42 days' },
              { name: 'Wedding Anniversary', date: 'February 14', daysLeft: 'in 124 days' },
              { name: "Amma's Day", date: 'May 10', daysLeft: 'Annual reminder' },
            ].map((rem, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#dac0c4]/40 text-[12.5px]"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#5e0b29] text-[18px]">
                    event
                  </span>
                  <span className="font-bold text-[#221a19]">{rem.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#544245] block">{rem.date}</span>
                  <span className="text-[10px] text-[#904858] font-bold">
                    {rem.daysLeft}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <span className="text-[11px] font-bold text-[#904858] uppercase tracking-wider block mb-2">
            Recent Keepsakes
          </span>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#dac0c4]/40">
              <div>
                <span className="text-[13px] font-bold text-[#5e0b29] block">
                  Good Vibes Gift Box
                </span>
                <span className="text-[11px] text-[#544245]">
                  Order GF-88421 • Delivered to Colombo 07
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenTrackOrder();
                }}
                className="px-3 py-1 rounded-full bg-[#fbeae8] text-[#5e0b29] text-[11px] font-bold hover:bg-[#f3dde0]"
              >
                Track
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
