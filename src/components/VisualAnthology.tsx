import React from 'react';
import { INSTAGRAM_POSTS } from '../data/mockData';

interface VisualAnthologyProps {
  onShowToast: (msg: string) => void;
}

export const VisualAnthology: React.FC<VisualAnthologyProps> = ({
  onShowToast,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span className="text-[11px] font-bold text-[#904858] uppercase tracking-widest block mb-1">
            Visual Anthology
          </span>
          <h2 className="font-editorial text-[30px] sm:text-[36px] text-[#5e0b29] font-normal">
            Made to make someone smile
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#544245]">
            Real unboxing moments and artisanal packaging craft.
          </p>
        </div>

        <button
          onClick={() => onShowToast('Opening @giftora.ceylon visual feed')}
          className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#5e0b29] hover:text-[#7c243f] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          <span>Follow @giftora.ceylon</span>
        </button>
      </div>

      {/* 5-Item Visual Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {INSTAGRAM_POSTS.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onShowToast('Unboxing moment liked ❤️')}
            className={`group relative rounded-xl overflow-hidden aspect-square bg-[#fbeae8] shadow-xs cursor-pointer ${
              idx === 4 ? 'col-span-2 md:col-span-1' : ''
            }`}
          >
            <img
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              alt={item.alt}
              src={item.image}
            />
            <div className="absolute inset-0 bg-[#5e0b29]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <span
                className="material-symbols-outlined text-[26px] transform scale-75 group-hover:scale-100 transition-transform"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => onShowToast('Redirecting to Instagram Stories @giftora.ceylon')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#fbeae8] text-[#5e0b29] text-[13px] font-semibold hover:bg-[#f0dfdd] transition-colors cursor-pointer"
        >
          <span>Follow Our Story on Instagram</span>
          <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
        </button>
      </div>
    </section>
  );
};
