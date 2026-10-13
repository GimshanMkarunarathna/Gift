import React from 'react';
import { GluckGifyLogo } from './brand/GluckGifyLogo';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onSelectOccasion: (occasion: string) => void;
  onOpenTrackOrder: () => void;
  onOpenConcierge: () => void;
  onShowToast: (msg: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectOccasion,
  onOpenTrackOrder,
  onOpenConcierge,
  onShowToast,
  onOpenAdmin,
}) => {
  return (
    <footer
      className="w-full bg-[#F3F7F2] border-t border-[#DDE5DA] mt-16 shadow-[0_-1px_6px_rgba(41,45,43,0.02)]"
      id="footer-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#DDE5DA]">
          {/* Brand Info */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <GluckGifyLogo size="sm" showText={false} glow={true} />
              <div className="flex flex-col">
                <span className="text-[18px] text-[#2B2D2F] font-bold tracking-tight leading-none">
                  GLÜCK GIFY
                </span>
                <span className="text-[9px] text-[#4CAF50] font-bold tracking-widest uppercase mt-1">
                  Cute Gify and Accessories
                </span>
              </div>
            </div>
            <p className="text-[13px] text-[#556353] leading-relaxed">
              Curating moments of blooming joy, charming animated loops, and handcrafted botanical accessories worldwide.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => onShowToast('Instagram @giftora.ceylon')}
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#fbeae8] flex items-center justify-center text-[#544245] hover:text-[#5e0b29] hover:bg-[#ffd9df] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </button>
              <button
                type="button"
                onClick={() => onShowToast('Pinterest @giftora.atelier')}
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full bg-[#fbeae8] flex items-center justify-center text-[#544245] hover:text-[#5e0b29] hover:bg-[#ffd9df] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">push_pin</span>
              </button>
              <button
                type="button"
                onClick={() => onShowToast('Facebook @giftora.ceylon')}
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#fbeae8] flex items-center justify-center text-[#544245] hover:text-[#5e0b29] hover:bg-[#ffd9df] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">public</span>
              </button>
            </div>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-2">
            <h3 className="font-editorial text-[16px] text-[#5e0b29] font-semibold tracking-wide mb-2">
              Shop
            </h3>
            <nav className="flex flex-col gap-2 text-[13px]">
              <button
                onClick={() => onSelectCategory('all')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                All Gifts
              </button>
              <button
                onClick={() => onSelectCategory('all')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Best Sellers
              </button>
              <button
                onClick={() => onSelectCategory('fresh-florals')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                New Arrivals
              </button>
              <button
                onClick={() => onSelectCategory('personalized')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Personalized Gifts
              </button>
              <button
                onClick={() => onSelectCategory('gift-hampers')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Gift Hampers
              </button>
              <button
                onClick={() => onSelectCategory('home-living')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Curated Sets
              </button>
              <button
                onClick={() => onSelectCategory('all')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Sale &amp; Special Editions
              </button>
            </nav>
          </div>

          {/* Occasions */}
          <div className="flex flex-col gap-2">
            <h3 className="font-editorial text-[16px] text-[#5e0b29] font-semibold tracking-wide mb-2">
              Occasions
            </h3>
            <nav className="flex flex-col gap-2 text-[13px]">
              <button
                onClick={() => onSelectOccasion('birthday')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Birthday
              </button>
              <button
                onClick={() => onSelectOccasion('anniversary')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Anniversary
              </button>
              <button
                onClick={() => onSelectOccasion('wedding')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Wedding &amp; Engagement
              </button>
              <button
                onClick={() => onSelectOccasion('graduation')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Graduation
              </button>
              <button
                onClick={() => onSelectOccasion('thank-you')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Thank You
              </button>
              <button
                onClick={() => onSelectOccasion('housewarming')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Housewarming
              </button>
            </nav>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-2">
            <h3 className="font-editorial text-[16px] text-[#5e0b29] font-semibold tracking-wide mb-2">
              Customer Care
            </h3>
            <nav className="flex flex-col gap-2 text-[13px]">
              <button
                onClick={onOpenTrackOrder}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Track Order
              </button>
              <button
                onClick={() => onShowToast('Colombo: Same-day express. Other districts: 2-3 business days.')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Islandwide Delivery
              </button>
              <button
                onClick={onOpenConcierge}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Bespoke Concierge
              </button>
              <button
                onClick={() => onShowToast('100% Happiness Guarantee: Immediate free replacements for any transit damage.')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Returns &amp; Replacements
              </button>
              <button
                onClick={onOpenConcierge}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Frequently Asked Questions
              </button>
              <a
                href="tel:+94112345678"
                className="text-[#5e0b29] font-bold hover:underline mt-1"
              >
                +94 11 234 5678
              </a>
            </nav>
          </div>

          {/* About & Ethics */}
          <div className="flex flex-col gap-2">
            <h3 className="font-editorial text-[16px] text-[#5e0b29] font-semibold tracking-wide mb-2">
              About &amp; Ethics
            </h3>
            <nav className="flex flex-col gap-2 text-[13px]">
              <button
                onClick={() => onShowToast('GIFTORA was born in Colombo with a dedication to timeless heartfelt giving.')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Our Story
              </button>
              <button
                onClick={() => onShowToast('We partner with master Sri Lankan potters, woodcarvers, and tea blenders.')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Artisanal Partners
              </button>
              <button
                onClick={() => onShowToast('Our blush keepsake boxes are 100% recyclable FSC-certified rigid board.')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Sustainable Packaging
              </button>
              <button
                onClick={onOpenConcierge}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Corporate Inquiries
              </button>
              <button
                onClick={() => onShowToast('Press inquiries: press@giftora.lk')}
                className="text-left text-[#544245] hover:text-[#5e0b29] transition-colors cursor-pointer"
              >
                Press &amp; Features
              </button>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="text-left text-[#5e0b29] font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1.5 pt-1"
                >
                  <span className="material-symbols-outlined text-[15px]">shield_person</span>
                  Administrator Portal
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Bottom Credits & Payments Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#544245]">
          <p>© 2027 GIFTORA (Pvt) Ltd. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-2 text-center">
            <span className="flex items-center gap-1 font-semibold text-[#5e0b29]">
              <span className="material-symbols-outlined text-[15px]">lock</span>
              100% Secure Checkout SSL
            </span>
            <span className="text-[#dac0c4]">|</span>
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>Amex</span>
            <span>•</span>
            <span>Koko</span>
            <span>•</span>
            <span>Mintpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
