import React, { useState } from 'react';
import { CartItem } from '../types';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalAmount: number;
  promoCodeApplied?: string;
  includeGiftWrap?: boolean;
  onOrderCompleted: (order: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  promoCodeApplied,
  includeGiftWrap = true,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('Anusha Perera');
  const [phone, setPhone] = useState('+94 77 987 6543');
  const [email, setEmail] = useState('anusha.p@gmail.com');
  const [address, setAddress] = useState('No. 42, Horton Place, Colombo 07');
  const [district, setDistrict] = useState('Colombo 01-15 (Express Same-Day)');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'koko' | 'mintpay' | 'cod'>('card');
  const [orderRef, setOrderRef] = useState('GF-94821');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const orderPayload = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        deliveryAddress: {
          recipientName: name,
          street: address,
          district: district,
        },
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          personalization: i.personalization,
        })),
        includeGiftWrap,
        couponCode: promoCodeApplied,
        paymentMethod,
      };

      const res = await api.orders.create(orderPayload);
      const createdOrder = res.order;
      setOrderRef(createdOrder.orderNumber);
      setStep('success');
      onOrderCompleted(createdOrder);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#382e2d]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#fff8f7] max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative border border-[#dac0c4]/50 my-6">
        {step === 'form' ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#fbeae8]">
              <div>
                <h3 className="font-editorial text-[22px] text-[#5e0b29] font-semibold">
                  Secure Gift Checkout
                </h3>
                <p className="text-[12.5px] text-[#544245]">
                  Complimentary artisan packaging &amp; wax seal included.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#fbeae8] text-[#544245] flex items-center justify-center hover:bg-[#f0dfdd] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[13px] border border-[#ffdad6]/80 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipient Details */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-bold text-[#5e0b29] uppercase tracking-wider">
                  Recipient &amp; Delivery Destination
                </h4>

                <div>
                  <label className="block text-[12px] font-bold text-[#544245] mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60 text-[13.5px] focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#544245] mb-1">
                      Recipient Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60 text-[13.5px] focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#544245] mb-1">
                      Delivery District
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60 text-[13.5px] focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                    >
                      <option>Colombo 01-15 (Express Same-Day)</option>
                      <option>Greater Colombo (Suburbs)</option>
                      <option>Kandy &amp; Central Province</option>
                      <option>Galle &amp; Southern Province</option>
                      <option>Gampaha &amp; Western Province</option>
                      <option>Islandwide (All other districts)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#544245] mb-1">
                    Street Address &amp; Landmarks
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#dac0c4]/60 text-[13.5px] focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <h4 className="text-[13px] font-bold text-[#5e0b29] uppercase tracking-wider mb-2.5">
                  Payment Method
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#5e0b29] bg-[#fbeae8] ring-1 ring-[#5e0b29]'
                        : 'border-[#dac0c4]/50 bg-white hover:bg-[#fff0ef]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#5e0b29]">
                      credit_card
                    </span>
                    <div>
                      <span className="text-[12.5px] font-bold text-[#221a19] block">
                        Credit / Debit Card
                      </span>
                      <span className="text-[10px] text-[#877275]">
                        Visa, Mastercard, Amex
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('koko')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                      paymentMethod === 'koko'
                        ? 'border-[#5e0b29] bg-[#fbeae8] ring-1 ring-[#5e0b29]'
                        : 'border-[#dac0c4]/50 bg-white hover:bg-[#fff0ef]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#5e0b29]">
                      payments
                    </span>
                    <div>
                      <span className="text-[12.5px] font-bold text-[#221a19] block">
                        Koko (3 Splits)
                      </span>
                      <span className="text-[10px] text-[#877275]">
                        LKR {Math.round(totalAmount / 3).toLocaleString()} / mo
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mintpay')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                      paymentMethod === 'mintpay'
                        ? 'border-[#5e0b29] bg-[#fbeae8] ring-1 ring-[#5e0b29]'
                        : 'border-[#dac0c4]/50 bg-white hover:bg-[#fff0ef]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#5e0b29]">
                      split_scene
                    </span>
                    <div>
                      <span className="text-[12.5px] font-bold text-[#221a19] block">
                        Mintpay Pay in 3
                      </span>
                      <span className="text-[10px] text-[#877275]">0% Interest</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#5e0b29] bg-[#fbeae8] ring-1 ring-[#5e0b29]'
                        : 'border-[#dac0c4]/50 bg-white hover:bg-[#fff0ef]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#5e0b29]">
                      handshake
                    </span>
                    <div>
                      <span className="text-[12.5px] font-bold text-[#221a19] block">
                        Cash on Delivery
                      </span>
                      <span className="text-[10px] text-[#877275]">Colombo only</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Order summary row */}
              <div className="p-3.5 rounded-xl bg-[#fff0ef] border border-[#dac0c4]/30 flex items-center justify-between">
                <div>
                  <span className="text-[12px] text-[#544245]">Total Payable:</span>
                  {promoCodeApplied && (
                    <span className="text-[11px] text-[#904858] font-bold ml-2">
                      ({promoCodeApplied} applied)
                    </span>
                  )}
                </div>
                <span className="text-[18px] font-bold text-[#5e0b29]">
                  LKR {totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#7c243f] text-white font-semibold text-[14px] hover:bg-[#5e0b29] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Complete Order &amp; Handcraft Gift</span>
              </button>
            </form>
          </div>
        ) : (
          /* Order Confirmed Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#f3dde0] text-[#5e0b29] flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-[36px]">
                verified
              </span>
            </div>

            <h3 className="font-editorial text-[26px] text-[#5e0b29] font-medium">
              Your Gift is in Loving Hands
            </h3>

            <p className="text-[14px] text-[#544245] max-w-md mx-auto">
              Order <span className="font-bold text-[#5e0b29]">{orderRef}</span> has been confirmed. Our calligraphers are preparing the personalized keepsake note and artisan wax seal.
            </p>

            <div className="p-4 rounded-xl bg-[#fff0ef] border border-[#dac0c4]/40 max-w-sm mx-auto text-left space-y-1.5 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-[#877275]">Recipient:</span>
                <span className="font-bold text-[#221a19]">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#877275]">Destination:</span>
                <span className="font-bold text-[#221a19]">{district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#877275]">Total Paid:</span>
                <span className="font-bold text-[#5e0b29]">
                  LKR {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#7c243f] text-white text-[13.5px] font-semibold hover:bg-[#5e0b29] cursor-pointer"
              >
                Continue Gifting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
