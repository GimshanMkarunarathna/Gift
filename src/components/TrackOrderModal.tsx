import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = 'GF-88421',
}) => {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && orderNumber) {
      handleTrack(orderNumber);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTrack = async (targetOrder: string) => {
    if (!targetOrder.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await api.orders.track(targetOrder.trim());
      setOrderData(data);
    } catch (err: any) {
      setError(err.message || 'Order not found. Please verify tracking reference.');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#382e2d]/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fff8f7] max-w-lg w-full rounded-2xl p-6 sm:p-7 shadow-2xl relative border border-[#dac0c4]/50">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#fbeae8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5e0b29] text-[22px]">
              local_shipping
            </span>
            <h3 className="font-editorial text-[20px] text-[#5e0b29] font-semibold">
              Track Your Gift Order
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#fbeae8] text-[#544245] flex items-center justify-center hover:bg-[#f0dfdd] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack(orderNumber);
          }}
          className="flex gap-2 mb-5"
        >
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter tracking code (e.g. GF-88421)"
            className="flex-1 px-3.5 py-2.5 rounded-lg bg-white border border-[#dac0c4]/60 text-[13.5px] uppercase focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-[#7c243f] text-white text-[13px] font-semibold hover:bg-[#5e0b29] cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Locating...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[13px] border border-[#ffdad6]/80 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Tracking Details */}
        {orderData && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-[#fff0ef] border border-[#dac0c4]/40 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-[#904858] uppercase tracking-wider block">
                  Order Reference
                </span>
                <span className="text-[15px] font-bold text-[#5e0b29]">
                  {orderData.orderNumber}
                </span>
                <p className="text-[12px] text-[#544245]">
                  Destination: {orderData.district}
                </p>
                {orderData.trackingNumber && (
                  <p className="text-[11px] font-mono text-[#904858]">
                    Courier Waybill: {orderData.trackingNumber}
                  </p>
                )}
              </div>
              <span className="px-3 py-1 rounded-full bg-[#f3dde0] text-[#5e0b29] text-[11px] font-bold uppercase">
                {orderData.fulfillmentStatus}
              </span>
            </div>

            {/* Stepper Timeline from actual database records */}
            <div className="space-y-4 pl-2 max-h-56 overflow-y-auto">
              {orderData.statusHistory && orderData.statusHistory.length > 0 ? (
                orderData.statusHistory.map((step: any, idx: number) => (
                  <div key={idx} className="flex gap-3 relative">
                    <div className="flex flex-col items-center">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold bg-[#5e0b29] text-white ring-2 ring-[#ffd9df]">
                        ✓
                      </span>
                      {idx < orderData.statusHistory.length - 1 && (
                        <div className="w-0.5 h-6 bg-[#dac0c4]/60 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-bold text-[#221a19] capitalize">
                          {step.status}
                        </p>
                        <span className="text-[11px] text-[#877275]">
                          {new Date(step.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#544245]">{step.note}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-[#877275]">Order placed and being processed.</p>
              )}
            </div>

            <div className="text-center pt-2 border-t border-[#fbeae8]">
              <p className="text-[12px] text-[#877275]">
                Need immediate help with this delivery?{' '}
                <a href="tel:+94112345678" className="text-[#5e0b29] font-bold underline">
                  Call +94 11 234 5678
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
