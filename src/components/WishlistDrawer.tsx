import React from 'react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onAddToCart,
  onRemoveFromWishlist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#382e2d]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fff8f7] shadow-2xl flex flex-col border-l border-[#dac0c4]/40">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#fbeae8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5e0b29] text-[22px]">
                favorite
              </span>
              <h2 className="font-editorial text-[20px] text-[#5e0b29] font-semibold">
                Saved Keepsakes
              </h2>
              <span className="text-[12px] text-[#904858] font-bold">
                ({wishlistProducts.length})
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#fbeae8] text-[#544245] flex items-center justify-center hover:bg-[#f0dfdd] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-[48px] text-[#dac0c4] mb-3">
                  favorite_border
                </span>
                <p className="font-editorial text-[18px] text-[#5e0b29] mb-2">
                  No saved keepsakes yet
                </p>
                <p className="text-[13px] text-[#544245] mb-6">
                  Click the heart icon on any gift to save it for upcoming celebrations.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#7c243f] text-white text-[13px] font-semibold hover:bg-[#5e0b29]"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3.5 rounded-xl bg-white border border-[#dac0c4]/40 shadow-xs items-center"
                >
                  <img
                    alt={product.title}
                    src={product.image}
                    className="w-20 h-22 object-cover rounded-lg bg-[#fbeae8] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-editorial text-[15px] font-semibold text-[#5e0b29] truncate">
                      {product.title}
                    </h4>
                    <p className="text-[13px] font-bold text-[#221a19] mt-0.5">
                      {product.formattedPrice}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onRemoveFromWishlist(product);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#5e0b29] text-white text-[11.5px] font-semibold hover:bg-[#7c243f] transition-colors cursor-pointer"
                      >
                        Move to Bag
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="text-[12px] text-[#877275] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
