import React from 'react';

interface CurationPathwaysProps {
  activePathway: string;
  onSelectPathway: (pathwayId: string) => void;
  onHelpMeChoose: () => void;
}

export const CurationPathways: React.FC<CurationPathwaysProps> = ({
  activePathway,
  onSelectPathway,
  onHelpMeChoose,
}) => {
  const pathways = [
    { id: 'all', label: 'All Pathways' },
    { id: 'birthday', label: '🎂 Birthday' },
    { id: 'anniversary', label: '💍 Anniversary' },
    { id: 'thank-you', label: '💌 Thank You' },
    { id: 'just-because', label: '✨ Just Because' },
    { id: 'budget', label: '🏷️ Under LKR 2,500' },
    { id: 'personalized', label: '🖋️ Personalized' },
  ];

  return (
    <section className="w-full bg-[#fff0ef] py-8 sm:py-10 border-y border-[#dac0c4]/30" id="gift-discovery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-bold text-[#904858] uppercase tracking-widest block mb-1">
              Curation Pathways
            </span>
            <h2 className="font-editorial text-[26px] sm:text-[30px] text-[#5e0b29] font-medium leading-tight">
              Find their kind of magic
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#544245]">
              Quick pathways to delightful, memorable gifting.
            </p>
          </div>

          <button
            onClick={onHelpMeChoose}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f3dde0] text-[#5e0b29] text-[13px] font-semibold hover:bg-[#ffd9df] transition-all cursor-pointer shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">magic_button</span>
            <span>Help Me Choose ✨</span>
          </button>
        </div>

        {/* Horizontal Scrollable Filter Chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {pathways.map((item) => {
            const isActive = activePathway === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPathway(item.id)}
                type="button"
                className={`shrink-0 px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#7c243f] text-white shadow-xs'
                    : 'bg-[#fff8f7] text-[#544245] hover:bg-[#fbeae8] border border-[#dac0c4]/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
