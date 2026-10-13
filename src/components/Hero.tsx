import React from 'react';
import { HERO_IMAGE } from '../data/mockData';

interface HeroProps {
  onShopGifts: () => void;
  onDiscoverGift: () => void;
  onOpenAtelier: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopGifts,
  onDiscoverGift,
  onOpenAtelier,
}) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-12 sm:pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Narrative Column (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#904858]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#5e0b29] uppercase">
              The Art of Giving
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-[38px] sm:text-[44px] lg:text-[48px] leading-[1.15] text-[#5e0b29] mb-4 font-normal">
            Make it personal. <br />
            Make it{' '}
            <span className="italic font-normal text-[#904858]">
              unforgettable.
            </span>
          </h1>

          {/* Supporting Editorial Text */}
          <p className="text-[16px] sm:text-[18px] text-[#544245] mb-8 leading-relaxed font-normal">
            Thoughtfully chosen gifts for the people who matter most. Discover something
            meaningful for every moment, beautifully wrapped and delivered across Sri Lanka.
          </p>

          {/* CTA Action Cluster */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={onShopGifts}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#7c243f] text-white text-[14px] font-semibold shadow-xs hover:bg-[#5e0b29] transition-all duration-300 group cursor-pointer"
            >
              <span>Shop Gifts</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            <button
              onClick={onDiscoverGift}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#fbeae8] text-[#5e0b29] text-[14px] font-semibold hover:bg-[#f3dde0] transition-colors cursor-pointer"
            >
              <span>Discover Your Gift</span>
              <span className="material-symbols-outlined text-[18px] text-[#904858]">
                auto_awesome
              </span>
            </button>
          </div>

          {/* 3 Compact Trust Micro-Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#dac0c4]/40">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#5e0b29] text-[20px] shrink-0 mt-0.5">
                palette
              </span>
              <div>
                <p className="text-[13px] font-bold text-[#5e0b29] leading-tight">
                  Thoughtfully Curated
                </p>
                <p className="text-[12px] text-[#544245] leading-snug">
                  Artisanal Ceylon craft
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#5e0b29] text-[20px] shrink-0 mt-0.5">
                redeem
              </span>
              <div>
                <p className="text-[13px] font-bold text-[#5e0b29] leading-tight">
                  Artisan Wrapped
                </p>
                <p className="text-[12px] text-[#544245] leading-snug">
                  Satin ribbon &amp; wax seal
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#5e0b29] text-[20px] shrink-0 mt-0.5">
                local_shipping
              </span>
              <div>
                <p className="text-[13px] font-bold text-[#5e0b29] leading-tight">
                  Islandwide Delivery
                </p>
                <p className="text-[12px] text-[#544245] leading-snug">
                  Colombo same-day
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Visual Column (7 Cols Asymmetric Layout) */}
        <div className="lg:col-span-7 relative">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-xl bg-[#fbeae8]">
            <img
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
              alt="Luxurious, warm editorial overhead photograph of an open blush pink keepsake gift box"
              src={HERO_IMAGE}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5e0b29]/30 via-transparent to-transparent pointer-events-none" />

            {/* Floating Editorial Keepsake Note Badge */}
            <button
              onClick={onOpenAtelier}
              className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-xs bg-[#fff8f7]/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#dac0c4]/40 flex items-center gap-3.5 text-left hover:scale-102 transition-transform cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-[#f3dde0] flex items-center justify-center shrink-0 text-[#5e0b29]">
                <span className="material-symbols-outlined text-[22px]">stylus</span>
              </div>
              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#904858] block font-bold">
                  Complimentary Detail
                </span>
                <p className="font-editorial text-[14px] text-[#5e0b29] leading-snug font-normal">
                  Hand-lettered calligraphy card sealed with signature wine wax.
                </p>
              </div>
            </button>
          </div>

          {/* Ambient decorative backdrop glow */}
          <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#ffd9df]/50 rounded-full blur-3xl -z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
