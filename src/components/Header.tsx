import React, { useState } from 'react';
import { GluckGifyLogo } from './brand/GluckGifyLogo';
import { LilyFlowerIcon, SparkleStarIcon } from './brand/BrandIcons';
import { USER_AVATAR } from '../data/mockData';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenTrackOrder: () => void;
  onOpenConcierge: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
  onSelectCategory: (category: string) => void;
  currentCategory: string;
  onOpenStudio?: () => void;
  onOpenLoadingDemo?: () => void;
  isStudioActive?: boolean;
  announcementText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenTrackOrder,
  onOpenConcierge,
  onOpenAccount,
  onOpenAdmin,
  isAdminLoggedIn,
  onSelectCategory,
  currentCategory,
  onOpenStudio,
  onOpenLoadingDemo,
  isStudioActive,
  announcementText,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop', id: 'all' },
    { label: 'Occasions', id: 'occasions', hasDot: true },
    { label: 'For Him', id: 'for-him' },
    { label: 'For Her', id: 'for-her' },
    { label: 'Personalized', id: 'personalized', hasDot: true },
    { label: 'Corporate Gifts', id: 'corporate' },
    { label: 'Our Story', id: 'our-story' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-[#fff8f7]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(41,32,31,0.04)] border-b border-[#dac0c4]/30">
      {/* Top Banner Bar */}
      <div className="w-full bg-[#F3F7F2] px-6 lg:px-10 py-1.5 hidden md:block border-b border-[#DDE5DA]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-bold tracking-[0.08em] text-[#3E4A3D]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4CAF50] text-[15px]">eco</span>
            <span>{announcementText || 'Complimentary botanical gift packaging on orders over LKR 5,000'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#2D6A4F] font-bold">
            <SparkleStarIcon size={14} accentColor="#E9C46A" />
            <span>Use code FIRSTJOY for 10% off your first cute gift</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenLoadingDemo && (
              <>
                <button
                  onClick={onOpenLoadingDemo}
                  className="text-[#2D6A4F] hover:text-[#1F2421] font-semibold flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-full border border-[#D5E1D2] shadow-2xs"
                  title="Experience Animated Lily Bloom Loading Screen"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-ping" />
                  <span>Bloom Screen</span>
                </button>
                <span className="text-[#CFDAC9]">•</span>
              </>
            )}

            <button
              onClick={onOpenTrackOrder}
              className="hover:text-[#2D6A4F] transition-colors focus:outline-none cursor-pointer"
            >
              Track Order
            </button>
            <span className="text-[#CFDAC9]">•</span>
            <button
              onClick={onOpenConcierge}
              className="hover:text-[#2D6A4F] transition-colors focus:outline-none cursor-pointer"
            >
              Concierge
            </button>
            <span className="text-[#CFDAC9]">•</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#2D6A4F] font-bold hover:underline flex items-center gap-1 cursor-pointer bg-[#EAF5EC] px-2 py-0.5 rounded-full"
              title="Protected Administrator Portal"
            >
              <span className="material-symbols-outlined text-[13px]">shield_person</span>
              <span>{isAdminLoggedIn ? 'Atelier Portal' : 'Admin Portal'}</span>
            </button>
            <span className="text-[#CFDAC9]">•</span>
            <span className="flex items-center gap-1 font-semibold text-[#2D6A4F]">
              <span className="material-symbols-outlined text-[14px]">payments</span>
              LKR (Rs)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onOpenStudio && isStudioActive) {
                // If studio is open, toggle back to storefront
              }
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <GluckGifyLogo size="sm" showText={false} glow={true} className="transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-[20px] tracking-[0.16em] text-[#2B2D2F] font-bold leading-none">
                GLÜCK GIFY
              </span>
              <span className="text-[8.5px] tracking-[0.24em] text-[#4CAF50] uppercase mt-1 font-bold">
                Cute Gify &amp; Accessories
              </span>
            </div>
          </button>
        </div>

        {/* Center Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {onOpenStudio && (
            <button
              onClick={onOpenStudio}
              className={`text-[14px] font-bold transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer ${
                isStudioActive
                  ? 'bg-[#EAF5EC] text-[#2D6A4F] ring-1 ring-[#4CAF50]'
                  : 'text-[#2D6A4F] hover:bg-[#EAF5EC]/70 bg-[#F4F8F3]'
              }`}
            >
              <LilyFlowerIcon size={16} accentColor="#4CAF50" />
              <span>Gify Studio &amp; Maker</span>
              <span className="text-[9px] bg-[#4CAF50] text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider font-extrabold">
                Cute Hub
              </span>
            </button>
          )}

          {navLinks.map((link) => {
            const isActive = !isStudioActive && currentCategory === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  if (isStudioActive && onOpenStudio) {
                    onOpenStudio(); // Close studio and return to store
                  }
                  if (link.id === 'occasions') {
                    const el = document.getElementById('milestones-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  } else if (link.id === 'our-story') {
                    const el = document.getElementById('footer-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  } else if (link.id === 'corporate') {
                    onOpenConcierge();
                  } else {
                    onSelectCategory(link.id);
                  }
                }}
                className={`text-[14.5px] transition-colors flex items-center gap-1 py-1 relative ${
                  isActive
                    ? 'text-[#2D6A4F] font-bold'
                    : 'text-[#4A5749] hover:text-[#2B2D2F]'
                }`}
              >
                <span>{link.label}</span>
                {link.hasDot && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E9C46A]" />
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4CAF50] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#f5e4e2] text-[#544245] hover:text-[#221a19] hover:bg-[#f0dfdd] transition-all cursor-pointer"
            type="button"
            title="Search gifts (⌘K)"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="text-[13px]">Search gifts</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#544245] shadow-xs font-mono font-medium">
              ⌘K
            </kbd>
          </button>

          {/* Mobile search icon */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-full text-[#544245] hover:bg-[#fbeae8]"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            aria-label="Wishlist"
            className="relative p-2 rounded-full text-[#544245] hover:text-[#5e0b29] hover:bg-[#fbeae8] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#5e0b29] text-white text-[9px] font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="Shopping Bag"
            className="relative p-2 rounded-full text-[#544245] hover:text-[#5e0b29] hover:bg-[#fbeae8] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#7c243f] text-white text-[9px] font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Avatar */}
          <div className="flex items-center pl-1 sm:pl-2">
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-[#dac0c4] transition-all"
              title="My Keepsakes & Account"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#dac0c4]"
                src={USER_AVATAR}
              />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#544245] hover:bg-[#fbeae8]"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fff8f7] border-t border-[#dac0c4]/40 px-6 py-4 shadow-xl">
          <nav className="flex flex-col gap-3">
            {onOpenStudio && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStudio();
                }}
                className="flex items-center justify-between text-left py-2.5 px-3 text-[15px] font-bold text-[#2D6A4F] bg-[#EAF5EC] rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <LilyFlowerIcon size={18} accentColor="#4CAF50" />
                  <span>Cute Gify Studio &amp; Maker</span>
                </div>
                <span className="text-[10px] bg-[#4CAF50] text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                  Explore
                </span>
              </button>
            )}

            {onOpenLoadingDemo && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoadingDemo();
                }}
                className="flex items-center justify-between text-left py-2 px-3 text-[14px] font-semibold text-[#2B2D2F] bg-white border border-[#DEE5DA] rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-ping" />
                  <span>Bloom Loading Screen</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#4CAF50]">play_circle</span>
              </button>
            )}

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.id === 'occasions') {
                    document.getElementById('milestones-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (link.id === 'our-story') {
                    document.getElementById('footer-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (link.id === 'corporate') {
                    onOpenConcierge();
                  } else {
                    onSelectCategory(link.id);
                  }
                }}
                className="flex items-center justify-between text-left py-2 text-[15px] text-[#221a19] font-medium border-b border-[#f0dfdd]/60"
              >
                <span>{link.label}</span>
                {link.hasDot && <span className="w-2 h-2 rounded-full bg-[#E9C46A]" />}
              </button>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[13px] text-[#425041]">
              <button onClick={onOpenTrackOrder} className="hover:text-[#2D6A4F]">
                Track Order
              </button>
              <button onClick={onOpenConcierge} className="hover:text-[#2D6A4F]">
                Help &amp; Concierge
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-[#2D6A4F] font-bold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">shield_person</span>
                {isAdminLoggedIn ? 'Atelier Portal' : 'Admin Portal'}
              </button>
              <span className="font-bold text-[#2D6A4F]">LKR (Rs)</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
