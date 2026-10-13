import React, { useState } from 'react';
import { PersonalizationData } from '../types';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PersonalizationData) => void;
  initialData?: PersonalizationData | null;
}

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [recipientName, setRecipientName] = useState(
    initialData?.recipientName || 'Ruwini'
  );
  const [message, setMessage] = useState(
    initialData?.message ||
      'May this year bring you boundless happiness, peace, and dreams fulfilled.'
  );
  const [waxSealColor, setWaxSealColor] = useState(
    initialData?.waxSealColor || 'Signature Burgundy'
  );
  const [fontStyle, setFontStyle] = useState(
    initialData?.fontStyle || 'Calligraphy'
  );

  if (!isOpen) return null;

  const waxSeals = [
    { name: 'Signature Burgundy', color: '#5e0b29', border: '#7c243f' },
    { name: 'Vintage Antique Gold', color: '#b58b4c', border: '#8c6527' },
    { name: 'Deep Forest Pine', color: '#1e3f20', border: '#2f5b33' },
    { name: 'Soft Rose Blush', color: '#d98596', border: '#b95a6f' },
  ];

  const handleSave = () => {
    onSave({
      recipientName,
      message,
      waxSealColor,
      fontStyle,
      ribbonColor: 'Double-faced Satin Blush',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#382e2d]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#fff8f7] max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative border border-[#dac0c4]/50 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#fbeae8]">
          <div>
            <h3 className="font-editorial text-[22px] text-[#5e0b29] font-medium leading-none">
              Inscribe Your Keepsake
            </h3>
            <p className="text-[12px] text-[#544245] mt-1">
              Custom hand-lettered stationery included with our compliments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#fbeae8] text-[#544245] flex items-center justify-center hover:bg-[#f0dfdd] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-[13px] font-bold text-[#5e0b29] mb-1.5">
              Recipient's Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Ruwini"
              className="w-full h-11 px-3.5 rounded-lg bg-white border border-[#dac0c4]/60 text-[14px] text-[#221a19] focus:outline-none focus:ring-2 focus:ring-[#5e0b29]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#5e0b29] mb-1.5">
              Sentiment Message
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a timeless note..."
              className="w-full p-3.5 rounded-lg bg-white border border-[#dac0c4]/60 text-[14px] text-[#221a19] focus:outline-none focus:ring-2 focus:ring-[#5e0b29]"
            />
          </div>

          {/* Wax Seal Selector */}
          <div>
            <label className="block text-[13px] font-bold text-[#5e0b29] mb-2">
              Signature Wax Seal Stamp
            </label>
            <div className="grid grid-cols-2 gap-2">
              {waxSeals.map((seal) => (
                <button
                  key={seal.name}
                  type="button"
                  onClick={() => setWaxSealColor(seal.name)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    waxSealColor === seal.name
                      ? 'border-[#5e0b29] bg-[#fbeae8] ring-1 ring-[#5e0b29]'
                      : 'border-[#dac0c4]/50 bg-white hover:bg-[#fff0ef]'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full shrink-0 shadow-xs border"
                    style={{ backgroundColor: seal.color, borderColor: seal.border }}
                  />
                  <span className="text-[12px] font-medium text-[#221a19] truncate">
                    {seal.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-5 rounded-xl bg-[#fff0ef] border border-[#dac0c4]/40 text-center relative shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#904858] block mb-2">
              Stationery Keepsake Card
            </span>

            <p className="font-editorial text-[17px] text-[#5e0b29] mb-1 font-semibold">
              {recipientName.trim() ? `Dearest ${recipientName},` : 'Dearest Recipient,'}
            </p>

            <p
              className={`text-[13.5px] text-[#544245] italic leading-relaxed px-2 my-2 ${
                fontStyle === 'Calligraphy' ? 'font-editorial' : ''
              }`}
            >
              "{message.trim() ? message : 'May this year bring you boundless happiness, peace, and dreams fulfilled.'}"
            </p>

            {/* Simulated Wax Seal Graphic */}
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold text-[#904858]">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>Wax-Sealed in {waxSealColor}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#fbeae8]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-[13px] font-semibold text-[#544245] hover:bg-[#fbeae8] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full bg-[#7c243f] text-white text-[13px] font-semibold hover:bg-[#5e0b29] shadow-xs transition-colors cursor-pointer"
          >
            Save &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
};
