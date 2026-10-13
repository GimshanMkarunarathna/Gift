import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : products.slice(0, 4);

  const quickSearches = ['Birthday', 'Hamper', 'Lamp', 'Brass', 'Bouquet', 'Spa', 'Ceramic'];

  return (
    <div className="fixed inset-0 z-50 bg-[#382e2d]/60 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="bg-[#fff8f7] max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden border border-[#dac0c4]/50 flex flex-col max-h-[80vh]">
        {/* Search input header */}
        <div className="p-4 sm:p-5 border-b border-[#fbeae8] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#5e0b29] text-[22px]">
            search
          </span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gifts, categories, sentiments..."
            className="flex-1 bg-transparent text-[16px] text-[#221a19] placeholder:text-[#877275] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#877275] hover:text-[#221a19] text-[12px] font-bold"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#fbeae8] text-[#544245] flex items-center justify-center hover:bg-[#f0dfdd] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Quick searches chips */}
        <div className="px-5 py-3 bg-[#fff0ef] border-b border-[#dac0c4]/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-[#904858] uppercase shrink-0">
            Suggestions:
          </span>
          {quickSearches.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="text-[11.5px] font-medium px-2.5 py-1 rounded-full bg-white text-[#544245] hover:bg-[#fbeae8] shrink-0 border border-[#dac0c4]/30 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          <p className="text-[11.5px] font-bold text-[#904858] uppercase tracking-wider mb-2">
            {query.trim() ? `Search Results (${filtered.length})` : 'Popular Recommendations'}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-10 text-[#544245]">
              <span className="material-symbols-outlined text-[36px] text-[#dac0c4] mb-2">
                sentiment_dissatisfied
              </span>
              <p className="text-[14px]">No gifts found for "{query}"</p>
            </div>
          ) : (
            filtered.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-[#fbeae8] transition-colors text-left group cursor-pointer"
              >
                <img
                  alt={product.title}
                  src={product.image}
                  className="w-14 h-16 object-cover rounded-lg bg-[#fbeae8] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-editorial text-[15px] font-semibold text-[#5e0b29] group-hover:text-[#7c243f] truncate">
                      {product.title}
                    </h4>
                    <span className="text-[13px] font-bold text-[#221a19] ml-2 shrink-0">
                      {product.formattedPrice}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#544245] truncate">
                    {product.description}
                  </p>
                  {product.featureTag && (
                    <span className="text-[10.5px] font-semibold text-[#904858] mt-0.5 inline-block">
                      {product.featureTag}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
