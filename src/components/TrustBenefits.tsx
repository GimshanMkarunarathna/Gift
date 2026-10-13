import React from 'react';

interface TrustBenefitsProps {
  onOpenConcierge: () => void;
  onOpenTrackOrder: () => void;
}

export const TrustBenefits: React.FC<TrustBenefitsProps> = ({
  onOpenConcierge,
  onOpenTrackOrder,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Benefit 1 */}
        <div className="p-6 rounded-xl bg-[#fff0ef] flex flex-col items-start border border-[#dac0c4]/30">
          <div className="w-12 h-12 rounded-full bg-[#fff8f7] flex items-center justify-center text-[#5e0b29] mb-4 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <h4 className="font-editorial text-[17px] text-[#5e0b29] font-semibold mb-1">
            Secure Payments
          </h4>
          <p className="text-[13px] text-[#544245] leading-relaxed">
            Visa, Mastercard, Amex, plus Koko &amp; Mintpay 3-month split options.
          </p>
        </div>

        {/* Benefit 2 */}
        <div
          onClick={onOpenTrackOrder}
          className="p-6 rounded-xl bg-[#fff0ef] flex flex-col items-start border border-[#dac0c4]/30 cursor-pointer hover:bg-[#fbeae8] transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-[#fff8f7] flex items-center justify-center text-[#5e0b29] mb-4 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">local_shipping</span>
          </div>
          <h4 className="font-editorial text-[17px] text-[#5e0b29] font-semibold mb-1">
            Reliable Delivery
          </h4>
          <p className="text-[13px] text-[#544245] leading-relaxed">
            Colombo express same-day &amp; standard islandwide courier tracking.
          </p>
        </div>

        {/* Benefit 3 */}
        <div className="p-6 rounded-xl bg-[#fff0ef] flex flex-col items-start border border-[#dac0c4]/30">
          <div className="w-12 h-12 rounded-full bg-[#fff8f7] flex items-center justify-center text-[#5e0b29] mb-4 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">
              featured_seasonal_and_gifts
            </span>
          </div>
          <h4 className="font-editorial text-[17px] text-[#5e0b29] font-semibold mb-1">
            Signature Packaging
          </h4>
          <p className="text-[13px] text-[#544245] leading-relaxed">
            Blush keepsake box, crinkle paper, satin ribbon &amp; artisanal wax seal.
          </p>
        </div>

        {/* Benefit 4 */}
        <div
          onClick={onOpenConcierge}
          className="p-6 rounded-xl bg-[#fff0ef] flex flex-col items-start border border-[#dac0c4]/30 cursor-pointer hover:bg-[#fbeae8] transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-[#fff8f7] flex items-center justify-center text-[#5e0b29] mb-4 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">support_agent</span>
          </div>
          <h4 className="font-editorial text-[17px] text-[#5e0b29] font-semibold mb-1">
            Concierge Care
          </h4>
          <p className="text-[13px] text-[#544245] leading-relaxed">
            Direct WhatsApp gifting assistance available 7 days a week.
          </p>
        </div>

        {/* Benefit 5 */}
        <div className="p-6 rounded-xl bg-[#fff0ef] flex flex-col items-start border border-[#dac0c4]/30">
          <div className="w-12 h-12 rounded-full bg-[#fff8f7] flex items-center justify-center text-[#5e0b29] mb-4 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">favorite_border</span>
          </div>
          <h4 className="font-editorial text-[17px] text-[#5e0b29] font-semibold mb-1">
            100% Happiness
          </h4>
          <p className="text-[13px] text-[#544245] leading-relaxed">
            Immediate free replacements for any item transit damage. No hassle.
          </p>
        </div>
      </div>
    </section>
  );
};
