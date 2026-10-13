import React from 'react';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onResetFilters,
}) => {
  return (
    <section className="w-full bg-[#fff0ef] py-12 sm:py-16" id="products-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="text-[11px] font-bold text-[#904858] uppercase tracking-widest block mb-1">
              Most Treasured
            </span>
            <h2 className="font-editorial text-[32px] sm:text-[38px] text-[#5e0b29] font-normal leading-tight">
              Gifts worth remembering
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#544245]">
              Thoughtful favorites, loved by everyone across the island.
            </p>
          </div>

          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#5e0b29] hover:text-[#7c243f] transition-colors group cursor-pointer"
          >
            <span>View All Gifts</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-[#fff8f7] rounded-2xl border border-[#dac0c4]/40 p-8">
            <span className="material-symbols-outlined text-[48px] text-[#904858] mb-3">
              redeem
            </span>
            <h3 className="font-editorial text-[22px] text-[#5e0b29] mb-2">
              No gifts match this filter
            </h3>
            <p className="text-[14px] text-[#544245] max-w-md mx-auto mb-6">
              Try choosing another curation pathway or reset to browse all handcrafted treasures.
            </p>
            <button
              onClick={onResetFilters}
              className="px-6 py-2.5 rounded-full bg-[#7c243f] text-white text-[13px] font-semibold hover:bg-[#5e0b29] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="group relative bg-[#fff8f7] rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#dac0c4]/30"
                >
                  {/* Image Container with Hover Actions */}
                  <div
                    onClick={() => onQuickView(product)}
                    className="relative w-full aspect-[4/5] bg-[#fbeae8] overflow-hidden cursor-pointer"
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={product.imageAlt}
                      src={product.image}
                    />

                    {/* Badge */}
                    {product.badge && (
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] tracking-wide uppercase font-bold text-white shadow-xs ${
                          product.badgeType === 'secondary'
                            ? 'bg-[#ffa5b7] text-[#7a3747]'
                            : product.badgeType === 'tertiary'
                            ? 'bg-[#f3dde0] text-[#5e0b29]'
                            : 'bg-[#5e0b29]'
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      aria-label="Save to Wishlist"
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-colors shadow-xs cursor-pointer ${
                        isWishlisted
                          ? 'text-[#5e0b29]'
                          : 'text-[#544245] hover:text-[#5e0b29]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[19px]"
                        style={{
                          fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Hover Slide-up Add to Bag Button */}
                    <div className="absolute inset-x-3 bottom-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="w-full py-2.5 rounded-full bg-[#5e0b29] text-white text-[13.5px] font-semibold flex items-center justify-center gap-1.5 shadow-md hover:bg-[#7c243f] cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          shopping_bag
                        </span>
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div
                    onClick={() => onQuickView(product)}
                    className="p-4 flex flex-col flex-grow justify-between cursor-pointer"
                  >
                    <div>
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-1">
                        <span
                          className="material-symbols-outlined text-[15px] text-[#904858]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="text-[12px] font-bold text-[#221a19]">
                          {product.rating.toFixed(1)}
                        </span>
                        <span className="text-[12px] text-[#877275]">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-editorial text-[17.5px] font-semibold text-[#5e0b29] leading-snug mb-1 group-hover:text-[#7c243f] transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-[13px] text-[#544245] line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Tag Footer */}
                    <div className="pt-2.5 flex items-center justify-between border-t border-[#fbeae8]">
                      <span className="text-[16px] font-bold text-[#5e0b29] tracking-tight">
                        {product.formattedPrice}
                      </span>
                      {product.featureTag && (
                        <span className="text-[11.5px] font-semibold text-[#904858]">
                          {product.featureTag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
