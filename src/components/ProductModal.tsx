import React, { useState } from 'react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    personalization?: { recipientName: string; message: string; waxSealColor: string }
  ) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [wantsPersonalization, setWantsPersonalization] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [waxSealColor, setWaxSealColor] = useState('Signature Burgundy');

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(
      product,
      quantity,
      wantsPersonalization && recipientName.trim()
        ? {
            recipientName,
            message: message || 'Wishing you unforgettable moments of joy and celebration.',
            waxSealColor,
          }
        : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#382e2d]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#fff8f7] max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden border border-[#dac0c4]/50 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-[#544245] flex items-center justify-center hover:bg-white shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Side */}
          <div className="relative bg-[#fbeae8] aspect-[4/5] md:aspect-auto">
            <img
              alt={product.imageAlt}
              src={product.image}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#5e0b29] text-white text-[10px] uppercase font-bold tracking-wider shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 sm:p-7 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
            <div>
              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex text-[#904858]">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[16px]"
                      style={{
                        fontVariationSettings:
                          i < Math.floor(product.rating) ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="text-[12px] font-bold text-[#221a19]">
                  {product.rating}
                </span>
                <span className="text-[12px] text-[#877275]">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Title & Price */}
              <h2 className="font-editorial text-[24px] text-[#5e0b29] font-semibold leading-tight mb-1">
                {product.title}
              </h2>
              <p className="text-[13px] text-[#904858] font-medium mb-3">
                {product.subtitle}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-[20px] font-bold text-[#5e0b29]">
                  {product.formattedPrice}
                </span>
                {product.featureTag && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f3dde0] text-[#5e0b29] text-[11px] font-semibold">
                    {product.featureTag}
                  </span>
                )}
              </div>

              <p className="text-[13.5px] text-[#544245] leading-relaxed mb-5">
                {product.description} Handcrafted with intentional care in Sri Lanka,
                presented inside our signature blush presentation keepsake box with silk
                satin ribbon.
              </p>

              {/* Personalization Toggle */}
              <div className="p-3.5 rounded-xl bg-[#fff0ef] border border-[#dac0c4]/40 mb-5">
                <label className="flex items-center gap-2 cursor-pointer text-[13px] font-bold text-[#5e0b29] mb-2">
                  <input
                    type="checkbox"
                    checked={wantsPersonalization}
                    onChange={(e) => setWantsPersonalization(e.target.checked)}
                    className="rounded text-[#5e0b29] focus:ring-[#5e0b29]"
                  />
                  <span>Add Complimentary Calligraphy Card &amp; Wax Seal</span>
                </label>

                {wantsPersonalization && (
                  <div className="space-y-2.5 pt-2 border-t border-[#dac0c4]/30">
                    <input
                      type="text"
                      placeholder="Recipient Name (e.g. Ruwini)"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#dac0c4]/60 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Short sentiment or blessing..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-white border border-[#dac0c4]/60 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                    />
                    <div className="flex items-center gap-2 text-[11.5px] text-[#544245]">
                      <span className="font-semibold">Wax Seal:</span>
                      {['Signature Burgundy', 'Antique Gold', 'Rose Blush'].map((seal) => (
                        <button
                          key={seal}
                          type="button"
                          onClick={() => setWaxSealColor(seal)}
                          className={`px-2 py-0.5 rounded text-[11px] border cursor-pointer ${
                            waxSealColor === seal
                              ? 'bg-[#5e0b29] text-white border-[#5e0b29]'
                              : 'bg-white border-[#dac0c4]/50 text-[#544245]'
                          }`}
                        >
                          {seal}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-3 border-t border-[#fbeae8]">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#dac0c4]/60 rounded-full bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-[#544245] hover:text-[#5e0b29] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-[13px] font-bold px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#544245] hover:text-[#5e0b29] cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 rounded-full bg-[#7c243f] text-white font-semibold text-[13.5px] hover:bg-[#5e0b29] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    shopping_bag
                  </span>
                  <span>
                    Add to Bag • LKR {(product.price * quantity).toLocaleString()}
                  </span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-full border border-[#dac0c4]/60 hover:bg-[#fbeae8] transition-colors cursor-pointer ${
                    isWishlisted ? 'text-[#5e0b29] bg-[#fbeae8]' : 'text-[#544245]'
                  }`}
                  title="Save to Wishlist"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    favorite
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
