import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#382e2d] text-[#feedeb] px-5 py-3.5 rounded-xl shadow-2xl border border-[#dac0c4]/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <span
        className="material-symbols-outlined text-[#ffa5b7] text-[20px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        auto_awesome
      </span>
      <span className="text-[13.5px] font-medium">{message}</span>
    </div>
  );
};
