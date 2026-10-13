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
            <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#2D6A4F] uppercase">
              GLÜCK GIFY — Cute Gify and Accessories
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-[38px] sm:text-[44px] lg:text-[48px] leading-[1.15] text-[#2B2D2F] mb-4 font-normal">
            Where Cute Gify <br />
            Meets{' '}
            <span className="italic font-normal text-[#2D6A4F]">
              Botanical Grace.
            </span>
          </h1>

          {/* Supporting Editorial Text */}
          <p className="text-[16px] sm:text-[17px] text-[#4F5D4D] mb-8 leading-relaxed font-normal">
            Discover charming animated gif loops, curated botanical accessories, and personalized keepsakes inspired by our signature blooming lily. Beautifully packed with love across Sri Lanka.
          </p>

          {/* CTA Action Cluster */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={onShopGifts}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2B2D2F] text-white text-[14px] font-semibold shadow-xs hover:bg-[#1F2421] transition-all duration-300 group cursor-pointer"
            >
              <span>Explore Boutique</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform text-[#4CAF50]">
                arrow_forward
              </span>
            </button>

            <button
              onClick={onDiscoverGift}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#EAF5EC] text-[#2D6A4F] text-[14px] font-semibold hover:bg-[#D9EEDB] transition-colors cursor-pointer"
            >
              <span>Find Cute Gify</span>
              <span className="material-symbols-outlined text-[18px] text-[#4CAF50]">
                auto_awesome
              </span>
            </button>
          </div>

          {/* 3 Compact Trust Micro-Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#DDE5DA]">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#4CAF50] text-[20px] shrink-0 mt-0.5">
                local_florist
              </span>
              <div>
                <p className="text-[13px] font-bold text-[#2B2D2F] leading-tight">
                  Handcrafted Lily Art
                </p>
                <p className="text-[12px] text-[#556353] leading-snug">
                  Vector line-art icons
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#4CAF50] text-[20px] shrink-0 mt-0.5">
                redeem
              </span>
              <div>
                <p className="text-[13px] font-bold text-[#2B2D2F] leading-tight">
                  Cute Accessories
                </p>
                <p className="text-[12px] text-[#556353] leading-snug">
                  Pins, scarves &amp; journals
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#4CAF50] text-[20px] shrink-0 mt-0.5">
                local_shipping
              </span>
              <div>
                <p className="text-[13px] font-bold text-[#2B2D2F] leading-tight">
                  Islandwide Delivery
                </p>
                <p className="text-[12px] text-[#556353] leading-snug">
                  Fast, tracked shipping
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
