import React, { useState } from 'react';

interface SmartGiftFinderProps {
  onCompleteFinder: (filters: {
    recipient: string;
    occasion: string;
    budget: string;
    vibe: string;
  }) => void;
}

export const SmartGiftFinder: React.FC<SmartGiftFinderProps> = ({
  onCompleteFinder,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    recipient: 'Partner',
    occasion: 'Birthday',
    budget: '1500-3000',
    vibe: 'Personalized',
  });
  const [matchCount, setMatchCount] = useState(18);

  const stepLabels = [
    'Recipient Profile',
    'Special Occasion',
    'Comfortable Budget',
    'Gift Vibe & Mood',
  ];

  const handleSelectOption = (key: 'recipient' | 'occasion' | 'budget' | 'vibe', val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
    // Simulate smart dynamic matching count
    setMatchCount(Math.floor(Math.random() * 8) + 12);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onCompleteFinder(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <section className="w-full bg-[#fff0ef] py-12 sm:py-16 border-y border-[#dac0c4]/30" id="smart-gift-finder">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f3dde0] text-[#5e0b29] text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[15px]">psychology</span>
            <span>Intelligent Concierge</span>
          </div>
          <h2 className="font-editorial text-[30px] sm:text-[38px] text-[#5e0b29] font-normal mb-2">
            Not sure what to get them?
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#544245] max-w-xl mx-auto">
            Tell us a little about who they are. We'll curate recommendations that match their unique heart.
          </p>
        </div>

        {/* Stepper Card */}
        <div className="bg-[#fff8f7] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#dac0c4]/40">
          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between text-[11px] text-[#904858] uppercase tracking-widest mb-2 font-bold">
              <span>Step {currentStep} of 4</span>
              <span>{stepLabels[currentStep - 1]}</span>
            </div>
            <div className="w-full h-1.5 bg-[#fbeae8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7c243f] transition-all duration-300"
                style={{ width: `${currentStep * 25}%` }}
              />
            </div>
          </div>

          {/* STEP 1: RECIPIENT */}
          {currentStep === 1 && (
            <div className="flex flex-col">
              <h3 className="font-editorial text-[22px] text-[#5e0b29] font-medium mb-5">
                Who are you shopping for?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-6">
                {[
                  { id: 'Partner', label: 'Partner', sub: 'Spouse, Partner', icon: 'favorite' },
                  { id: 'Friend', label: 'Friend', sub: 'Best friend, Companion', icon: 'sentiment_satisfied' },
                  { id: 'Mother', label: 'Mother', sub: 'Amma, Mom', icon: 'spa' },
                  { id: 'Father', label: 'Father', sub: 'Thaththa, Dad', icon: 'shield' },
                  { id: 'Sibling', label: 'Sibling', sub: 'Brother, Sister', icon: 'groups' },
                  { id: 'Colleague', label: 'Colleague', sub: 'Team, Mentor, Client', icon: 'business_center' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectOption('recipient', item.id)}
                    className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl text-left transition-all cursor-pointer border ${
                      answers.recipient === item.id
                        ? 'bg-[#f3dde0] ring-2 ring-[#5e0b29] border-[#5e0b29]'
                        : 'bg-[#fff0ef] border-[#dac0c4]/40 hover:bg-[#fbeae8]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#5e0b29] text-[24px]">
                      {item.icon}
                    </span>
                    <div>
                      <span className="text-[14px] font-bold text-[#5e0b29] block">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-[#544245]">
                        {item.sub}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: OCCASION */}
          {currentStep === 2 && (
            <div className="flex flex-col">
              <h3 className="font-editorial text-[22px] text-[#5e0b29] font-medium mb-5">
                What is the occasion?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-6">
                {[
                  { id: 'Birthday', label: 'Birthday', icon: 'cake' },
                  { id: 'Anniversary', label: 'Anniversary', icon: 'diamond' },
                  { id: 'Graduation', label: 'Graduation', icon: 'school' },
                  { id: 'Thank You', label: 'Thank You', icon: 'handshake' },
                  { id: 'Just Because', label: 'Just Because', icon: 'auto_awesome' },
                  { id: 'New Home', label: 'New Home', icon: 'cottage' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectOption('occasion', item.id)}
                    className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl text-left transition-all cursor-pointer border ${
                      answers.occasion === item.id
                        ? 'bg-[#f3dde0] ring-2 ring-[#5e0b29] border-[#5e0b29]'
                        : 'bg-[#fff0ef] border-[#dac0c4]/40 hover:bg-[#fbeae8]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#5e0b29] text-[24px]">
                      {item.icon}
                    </span>
                    <span className="text-[14px] font-bold text-[#5e0b29]">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET */}
          {currentStep === 3 && (
            <div className="flex flex-col">
              <h3 className="font-editorial text-[22px] text-[#5e0b29] font-medium mb-5">
                What's your comfortable budget?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
                {[
                  { id: 'under-1500', tier: 'Modest', range: 'Under LKR 1,500', desc: 'Sweet keepsakes' },
                  { id: '1500-3000', tier: 'Popular', range: 'LKR 1,500–3,000', desc: 'Curated hampers' },
                  { id: '3000-5000', tier: 'Premium', range: 'LKR 3,000–5,000', desc: 'Luxury boxes' },
                  { id: 'above-5000', tier: 'Grand', range: 'Above LKR 5,000', desc: 'Artisanal collectors' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectOption('budget', item.id)}
                    className={`flex flex-col p-4 rounded-xl text-left transition-all cursor-pointer border ${
                      answers.budget === item.id
                        ? 'bg-[#f3dde0] ring-2 ring-[#5e0b29] border-[#5e0b29]'
                        : 'bg-[#fff0ef] border-[#dac0c4]/40 hover:bg-[#fbeae8]'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-[#904858] uppercase">
                      {item.tier}
                    </span>
                    <span className="font-editorial text-[16px] text-[#5e0b29] font-semibold mt-1">
                      {item.range}
                    </span>
                    <span className="text-[12px] text-[#544245] mt-0.5">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: VIBE */}
          {currentStep === 4 && (
            <div className="flex flex-col">
              <h3 className="font-editorial text-[22px] text-[#5e0b29] font-medium mb-5">
                What vibe resonates most?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-6">
                {[
                  { id: 'Personalized', label: 'Personalized', desc: 'Name engraved, keepsake', icon: 'stylus' },
                  { id: 'Relaxing', label: 'Relaxing', desc: 'Spa, aromatics, candles', icon: 'self_improvement' },
                  { id: 'Romantic', label: 'Romantic', desc: 'Roses, love notes, wine', icon: 'favorite' },
                  { id: 'Practical', label: 'Practical', desc: 'Home items, mugs, trays', icon: 'home' },
                  { id: 'Gourmet', label: 'Gourmet', desc: 'Chocolates, teas, sweets', icon: 'restaurant' },
                  { id: 'Botanical', label: 'Botanical', desc: 'Bouquets, dried florals', icon: 'local_florist' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectOption('vibe', item.id)}
                    className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl text-left transition-all cursor-pointer border ${
                      answers.vibe === item.id
                        ? 'bg-[#f3dde0] ring-2 ring-[#5e0b29] border-[#5e0b29]'
                        : 'bg-[#fff0ef] border-[#dac0c4]/40 hover:bg-[#fbeae8]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#5e0b29] text-[24px]">
                      {item.icon}
                    </span>
                    <div>
                      <span className="text-[14px] font-bold text-[#5e0b29] block">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-[#544245]">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stepper Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#fbeae8]">
            <button
              type="button"
              onClick={handleBack}
              className={`px-5 py-2.5 rounded-full text-[13px] font-semibold text-[#544245] hover:bg-[#fbeae8] transition-colors cursor-pointer ${
                currentStep === 1 ? 'invisible' : 'visible'
              }`}
            >
              Back
            </button>

            <div className="flex items-center gap-4">
              <span className="text-[12px] text-[#904858] font-bold hidden sm:inline-block">
                {matchCount} matching gifts found
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="px-7 py-3 rounded-full bg-[#7c243f] text-white text-[13.5px] font-semibold hover:bg-[#5e0b29] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentStep === 4 ? 'Find My Gifts ✨' : 'Next Step'}</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
