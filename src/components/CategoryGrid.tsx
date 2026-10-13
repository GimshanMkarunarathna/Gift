import React from 'react';
import { CATEGORIES } from '../data/mockData';

interface CategoryGridProps {
  onSelectCategory: (categorySlug: string) => void;
  selectedCategory: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-[11px] font-bold text-[#904858] uppercase tracking-widest block mb-1">
            Catalog
          </span>
          <h2 className="font-editorial text-[26px] sm:text-[30px] text-[#5e0b29] font-medium">
            Shop by Curated Category
          </h2>
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          className="hidden sm:inline-flex items-center gap-1 text-[13px] font-bold text-[#5e0b29] hover:text-[#7c243f] transition-colors"
        >
          <span>View all departments</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* 9 Distinct Category Roundels */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 sm:gap-5">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group flex flex-col items-center text-center p-2 rounded-2xl transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#fbeae8] ring-1 ring-[#5e0b29]'
                  : 'hover:bg-[#fbeae8]'
              }`}
            >
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden mb-2.5 shadow-xs bg-[#fbeae8] ring-2 ring-white">
                <img
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  alt={cat.imageAlt}
                  src={cat.image}
                />
                {cat.badge && (
                  <span
                    className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider text-white shadow-xs ${
                      cat.badgeType === 'primary'
                        ? 'bg-[#5e0b29]'
                        : cat.badgeType === 'secondary'
                        ? 'bg-[#904858]'
                        : 'bg-[#7c243f]'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </div>
              <span className="text-[12.5px] font-semibold text-[#221a19] group-hover:text-[#5e0b29] transition-colors line-clamp-1">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
