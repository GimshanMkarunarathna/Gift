import React from 'react';
import { ATELIER_IMAGE } from '../data/mockData';
import { PersonalizationData } from '../types';

interface PersonalizationAtelierProps {
  onOpenModal: () => void;
  savedPersonalization?: PersonalizationData | null;
}

export const PersonalizationAtelier: React.FC<PersonalizationAtelierProps> = ({
  onOpenModal,
  savedPersonalization,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <div className="bg-[#fbeae8] rounded-2xl p-6 sm:p-10 lg:p-14 shadow-xs border border-[#dac0c4]/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Narrative Side (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5e0b29]" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#904858] uppercase">
                The Giftora Atelier
              </span>
            </div>

            <h2 className="font-editorial text-[32px] sm:text-[40px] leading-[1.15] text-[#5e0b29] mb-3">
              A little detail.<br />
              <span className="italic text-[#904858] font-normal">
                A lot of meaning.
              </span>
            </h2>

            <p className="text-[15px] sm:text-[17px] text-[#544245] mb-6 sm:mb-8 leading-relaxed">
              Make every gift uniquely theirs with personalized messages, names, dates,
              and thoughtful finishing touches that turn an object into an heirloom.
            </p>

            {/* 3 Short Key Benefits */}
            <div className="flex flex-col gap-4 sm:gap-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#fff8f7] flex items-center justify-center shrink-0 text-[#5e0b29] shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">edit_note</span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#5e0b29]">
                    Custom Names &amp; Messages
                  </h4>
                  <p className="text-[13px] text-[#544245]">
                    Free laser engraving or hand-lettered ink calligraphy on every order.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#fff8f7] flex items-center justify-center shrink-0 text-[#5e0b29] shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#5e0b29]">
                    Bespoke Gift Wrapping
                  </h4>
                  <p className="text-[13px] text-[#544245]">
                    Signature blush textured keepsake box with hand-poured custom wax seal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#fff8f7] flex items-center justify-center shrink-0 text-[#5e0b29] shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#5e0b29]">
                    Made Just for Them
                  </h4>
                  <p className="text-[13px] text-[#544245]">
                    Crafted with intentional care and prepared within 24 hours.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={onOpenModal}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#7c243f] text-white text-[14px] font-semibold hover:bg-[#5e0b29] shadow-xs transition-all duration-300 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">brush</span>
                <span>
                  {savedPersonalization ? 'Edit Your Keepsake Note' : 'Create a Personalized Gift'}
                </span>
              </button>
            </div>
          </div>

          {/* Visual Side (6 Cols Collage Composition) */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-[#fff8f7]">
              <img
                className="w-full h-full object-cover"
                alt="Montage of personalized gift craftsmanship"
                src={ATELIER_IMAGE}
              />
            </div>

            {/* Inscribed Stationery Mini Preview Floating Tile */}
            <div className="absolute -bottom-6 -left-2 sm:left-4 max-w-xs bg-[#fff8f7] p-4 rounded-xl shadow-lg border border-[#dac0c4]/40 hidden sm:block">
              <div className="flex items-center gap-2 mb-1 text-[#904858]">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  Live Preview
                </span>
              </div>
              <p className="font-editorial text-[14px] italic text-[#5e0b29] leading-snug">
                {savedPersonalization
                  ? `"${savedPersonalization.message || 'With all our heartfelt love...'}"`
                  : '"To Ayodhya, with all our love on your new chapter."'}
              </p>
              <span className="text-[11px] text-[#877275] mt-1.5 block">
                {savedPersonalization?.recipientName
                  ? `— For ${savedPersonalization.recipientName} • ${savedPersonalization.waxSealColor} Seal`
                  : '— Gold Embossed Wax Seal #42'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
