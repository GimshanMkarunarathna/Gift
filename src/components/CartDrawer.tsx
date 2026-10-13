import React, { useState } from 'react';
import { CartItem } from '../types';
import { api } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (total: number, discountCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validatedCode, setValidatedCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [includeGiftWrap, setIncludeGiftWrap] = useState(true);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const isFreeWrapping = subtotal >= 5000;
  const giftWrapCost = includeGiftWrap && !isFreeWrapping ? 450 : 0;
  const deliveryCost = subtotal >= 10000 || subtotal === 0 ? 0 : 450;
  const finalTotal = Math.max(0, subtotal - discountAmount + giftWrapCost + deliveryCost);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError(null);
    setIsApplyingPromo(true);

    try {
      const res = await api.coupons.validate(promoCode.trim(), subtotal);
      if (res.valid) {
        setDiscountAmount(res.calculatedDiscount);
        setValidatedCode(res.code);
      }
    } catch (err: any) {
      setPromoError(err.message || 'Invalid promotion code.');
      setDiscountAmount(0);
      setValidatedCode('');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#382e2d]/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fff8f7] shadow-2xl flex flex-col border-l border-[#dac0c4]/40">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#fbeae8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5e0b29] text-[22px]">
                shopping_bag
              </span>
              <h2 className="font-editorial text-[20px] text-[#5e0b29] font-semibold">
                Your Curated Bag
              </h2>
              <span className="text-[12px] text-[#904858] font-bold">
                ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#fbeae8] text-[#544245] flex items-center justify-center hover:bg-[#f0dfdd] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Complimentary wrapping progress */}
          <div className="px-5 sm:px-6 py-3 bg-[#fff0ef] border-b border-[#dac0c4]/30">
            {subtotal >= 5000 ? (
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#5e0b29]">
                <span className="material-symbols-outlined text-[16px] text-[#5e0b29]">
                  check_circle
                </span>
                <span>You unlocked Complimentary Luxury Wrapping &amp; Wax Seal!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-[11.5px] font-medium text-[#544245] mb-1.5">
                  <span>Add LKR {(5000 - subtotal).toLocaleString()} more for free luxury gift wrap</span>
                  <span className="font-bold text-[#5e0b29]">
                    {Math.round((subtotal / 5000) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#fbeae8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5e0b29] transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / 5000) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-[48px] text-[#dac0c4] mb-3">
                  shopping_bag
                </span>
                <p className="font-editorial text-[18px] text-[#5e0b29] mb-2">
                  Your gift bag is empty
                </p>
                <p className="text-[13px] text-[#544245] mb-6">
                  Explore our curated keepsake collections to add thoughtful gifts.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#7c243f] text-white text-[13px] font-semibold hover:bg-[#5e0b29]"
                >
                  Discover Gifts
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-xl bg-white border border-[#dac0c4]/40 shadow-xs"
                >
                  <img
                    alt={item.product.title}
                    src={item.product.image}
                    className="w-18 h-22 object-cover rounded-lg bg-[#fbeae8] shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-editorial text-[15px] font-semibold text-[#5e0b29] leading-snug">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#877275] hover:text-[#ba1a1a] p-0.5 cursor-pointer"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                        </button>
                      </div>
                      <p className="text-[12px] text-[#544245] mt-0.5">
                        {item.product.formattedPrice}
                      </p>

                      {item.personalization?.recipientName && (
                        <div className="mt-1 text-[11px] text-[#904858] bg-[#fff0ef] px-2 py-0.5 rounded-md inline-block">
                          ✍️ To {item.personalization.recipientName} ({item.personalization.waxSealColor})
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#fbeae8]">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#dac0c4]/50 rounded-full bg-[#fff8f7]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-[#544245] hover:text-[#5e0b29] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-[12px] font-bold text-[#221a19] px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#544245] hover:text-[#5e0b29] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-[14px] font-bold text-[#5e0b29]">
                        LKR {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#fff0ef] border-t border-[#dac0c4]/40 space-y-3">
              {/* Gift wrap checkbox */}
              <label className="flex items-center gap-2.5 text-[12.5px] text-[#221a19] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGiftWrap}
                  onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                  className="rounded text-[#5e0b29] focus:ring-[#5e0b29] w-4 h-4"
                />
                <span className="flex-1">
                  Signature Blush Gift Box, Satin Ribbon &amp; Wax Seal
                </span>
                <span className="font-bold text-[#5e0b29]">
                  {isFreeWrapping ? 'FREE' : 'LKR 450'}
                </span>
              </label>

              {/* Promo code */}
              <div className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. FIRSTJOY)"
                    disabled={!!validatedCode}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#dac0c4]/60 text-[12.5px] uppercase focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={!!validatedCode || isApplyingPromo}
                    className="px-3 py-1.5 rounded-lg bg-[#fbeae8] text-[#5e0b29] font-bold text-[12px] hover:bg-[#f3dde0] disabled:opacity-50 cursor-pointer"
                  >
                    {validatedCode ? 'Applied ✓' : isApplyingPromo ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-[#ba1a1a]">{promoError}</p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-[12.5px] text-[#544245] pt-2 border-t border-[#dac0c4]/30">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#221a19]">
                    LKR {subtotal.toLocaleString()}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#5e0b29] font-semibold">
                    <span>Discount ({validatedCode})</span>
                    <span>- LKR {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery (Colombo Same-Day)</span>
                  <span>{deliveryCost === 0 ? 'FREE' : `LKR ${deliveryCost}`}</span>
                </div>
                <div className="flex justify-between text-[15px] font-bold text-[#5e0b29] pt-2 border-t border-[#dac0c4]/40">
                  <span>Estimated Total</span>
                  <span>LKR {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => onCheckout(finalTotal, validatedCode)}
                className="w-full py-3.5 rounded-full bg-[#7c243f] text-white font-semibold text-[14px] hover:bg-[#5e0b29] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
