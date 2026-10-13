import React from 'react';
import { OCCASIONS } from '../data/mockData';

interface OccasionGridProps {
  onSelectOccasion: (occasionSlug: string) => void;
}

export const OccasionGrid: React.FC<OccasionGridProps> = ({
  onSelectOccasion,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16" id="milestones-section">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span className="text-[11px] font-bold text-[#904858] uppercase tracking-widest block mb-1">
            Milestones &amp; Moments
          </span>
          <h2 className="font-editorial text-[30px] sm:text-[36px] text-[#5e0b29] font-normal">
            Make every occasion unforgettable
          </h2>
        </div>

        <button
          onClick={() => onSelectOccasion('all')}
          className="inline-flex items-center gap-1 text-[13.5px] font-bold text-[#5e0b29] hover:text-[#7c243f] transition-colors group cursor-pointer"
        >
          <span>Explore All Occasions</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>

      {/* 6 Visually Rich Photography Tiles with Warm Overlays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {OCCASIONS.map((occ) => (
          <button
            key={occ.id}
            onClick={() => onSelectOccasion(occ.slug)}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xs bg-[#fbeae8] text-left cursor-pointer transition-all duration-300 hover:shadow-lg"
          >
            <img
              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
              alt={occ.imageAlt}
              src={occ.image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5e0b29]/90 via-[#5e0b29]/30 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] tracking-widest uppercase text-[#ffd9df] block mb-1 font-bold">
                {occ.tagline}
              </span>
              <h3 className="font-editorial text-[22px] font-semibold mb-1 leading-tight">
                {occ.title}
              </h3>
              <p className="text-[13px] text-[#f5e4e2] line-clamp-1 opacity-90">
                {occ.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
