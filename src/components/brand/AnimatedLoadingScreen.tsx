import React, { useState, useEffect } from 'react';

interface AnimatedLoadingScreenProps {
  isOpen: boolean;
  onClose?: () => void;
  message?: string;
  autoCloseMs?: number; // Optional auto-dismiss duration
}

export const AnimatedLoadingScreen: React.FC<AnimatedLoadingScreenProps> = ({
  isOpen,
  onClose,
  message = 'Awakening the botanical atelier...',
  autoCloseMs,
}) => {
  // Phase loop: 0 = bud, 1 = growing bud, 2 = unfurling bloom + golden halo, 3 = full bloom pulse
  const [phase, setPhase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(15);

  useEffect(() => {
    if (!isOpen) return;

    // Reset cycle
    setPhase(0);
    setProgress(15);

    // Phase timers to create the 4-step bloom loop
    const cycleInterval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 15;
        return prev + 6;
      });
    }, 280);

    let autoCloseTimer: any;
    if (autoCloseMs && onClose) {
      autoCloseTimer = setTimeout(() => {
        onClose();
      }, autoCloseMs);
    }

    return () => {
      clearInterval(cycleInterval);
      clearInterval(progressInterval);
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
    };
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  const phaseStatusTexts = [
    'Nurturing the green stem and delicate buds...',
    'Petals are gently unfurling in the sunlight...',
    'Golden floral radiance in full bloom...',
    'Welcome to GLÜCK GIFY Cute Atelier',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF9F6] text-[#2B2D2F] select-none transition-opacity duration-700 animate-fadeIn"
      style={{
        backgroundImage: `radial-gradient(circle at center, #FFFFFF 0%, #FAF9F6 70%, #F3F4EE 100%)`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="GLÜCK GIFY Loading Screen"
    >
      {/* Background Soft Floating Sparkles & Petal Specks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-[#E9C46A] blur-[1px] animate-pulse" />
        <div className="absolute top-1/3 right-1/5 w-3 h-3 rounded-full bg-[#52B788] blur-[1px] animate-ping duration-1000" />
        <div className="absolute bottom-1/4 left-1/4 w-2.5 h-2.5 rounded-full bg-[#E9C46A] blur-[1px] animate-pulse delay-700" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-[#4CAF50] blur-[1px] animate-pulse delay-500" />
      </div>

      {/* Close/Skip Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold text-[#526053] bg-white/80 hover:bg-white border border-[#DCE2D5] rounded-full shadow-xs transition-all cursor-pointer hover:text-[#2B2D2F]"
          title="Continue to application"
        >
          <span>Skip to Atelier</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      )}

      {/* Main Animated Bloom Arena */}
      <div className="relative flex flex-col items-center justify-center p-8 max-w-md w-full text-center">
        {/* Pulsing Golden Halo behind the Lily (active in phase 2 and 3) */}
        <div
          className={`absolute w-72 h-72 rounded-full transition-all duration-1000 pointer-events-none ${
            phase >= 2
              ? 'bg-radial from-[#FEE48E]/45 via-[#FAF0C0]/25 to-transparent scale-110 opacity-100 blur-xl'
              : 'scale-75 opacity-0 blur-md'
          }`}
        />

        {/* Center SVG Lily Animation */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="loadingStemGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#52B788" />
                <stop offset="60%" stopColor="#40916C" />
                <stop offset="100%" stopColor="#2D6A4F" />
              </linearGradient>

              <radialGradient id="loadingHaloGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF9E6" stopOpacity="1" />
                <stop offset="50%" stopColor="#FEE9A0" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FAF9F6" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Circular Base Grounding Guide */}
            <circle
              cx="120"
              cy="120"
              r="105"
              stroke="#E1E6D8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-40"
            />

            {/* Top Four-Point Star */}
            <g
              transform="translate(120, 28)"
              className={`transition-all duration-700 ${
                phase >= 2 ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
              }`}
            >
              <path
                d="M 0,-8 Q 1,-1 8,0 Q 1,1 0,8 Q -1,1 -8,0 Q -1,-1 0,-8 Z"
                fill="#E9C46A"
              />
            </g>

            {/* Left Star */}
            <g
              transform="translate(38, 120)"
              className={`transition-all duration-700 ${
                phase >= 2 ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
              }`}
            >
              <path
                d="M 0,-6 Q 1,-1 6,0 Q 1,1 0,6 Q -1,1 -6,0 Q -1,-1 0,-6 Z"
                fill="#4CAF50"
              />
            </g>

            {/* Right Star */}
            <g
              transform="translate(202, 120)"
              className={`transition-all duration-700 ${
                phase >= 2 ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
              }`}
            >
              <path
                d="M 0,-6 Q 1,-1 6,0 Q 1,1 0,6 Q -1,1 -6,0 Q -1,-1 0,-6 Z"
                fill="#4CAF50"
              />
            </g>

            {/* 1. Lily Stem: Always visible, grows smoothly */}
            <path
              d="M 120 195 Q 119 150 120 102"
              stroke="url(#loadingStemGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              className="transition-all duration-700"
            />

            {/* 2. Leaves: Sway gently with phases */}
            {/* Left Leaf */}
            <path
              d="M 120 160 C 102 150 94 135 98 126 C 106 136 114 148 120 152 Z"
              fill="url(#loadingStemGrad)"
              stroke="#2B2D2F"
              strokeWidth="0.8"
              className={`transition-transform duration-1000 origin-[120px_160px] ${
                phase === 0 ? 'scale-90 rotate-[-4deg]' : 'scale-100 rotate-0'
              }`}
            />

            {/* Right Leaf */}
            <path
              d="M 120 166 C 136 160 152 150 156 142 C 149 152 135 162 120 166 Z"
              fill="url(#loadingStemGrad)"
              stroke="#2B2D2F"
              strokeWidth="0.8"
              className={`transition-transform duration-1000 origin-[120px_166px] ${
                phase === 0 ? 'scale-90 rotate-[4deg]' : 'scale-100 rotate-0'
              }`}
            />

            {/* 3. The Central Lily Flower (Unfurling Transformation) */}
            <g id="flowerBloomGroup" className="transition-all duration-1000 ease-out">
              {/* TIGHT BUD STATE (Phase 0) */}
              {phase === 0 && (
                <g className="transition-opacity duration-500 animate-pulse">
                  {/* Tight green sepal wrap */}
                  <path
                    d="M 120 102 C 112 88 114 74 120 66 C 126 74 128 88 120 102 Z"
                    fill="#F2F5EB"
                    stroke="#4CAF50"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M 120 102 Q 120 80 120 68"
                    stroke="#52B788"
                    strokeWidth="1.2"
                  />
                </g>
              )}

              {/* GROWING BUD UNFURLING (Phase 1) */}
              {phase === 1 && (
                <g className="transition-all duration-700 ease-in-out">
                  {/* Central growing bud spreading */}
                  <path
                    d="M 120 102 C 110 82 112 60 120 50 C 128 60 130 82 120 102 Z"
                    fill="#FFFFFF"
                    stroke="#8BA180"
                    strokeWidth="1.4"
                  />
                  {/* Left petal unfurling tip */}
                  <path
                    d="M 118 100 C 104 88 98 78 100 70 C 108 78 116 92 118 100 Z"
                    fill="#FAFAF5"
                    stroke="#8BA180"
                    strokeWidth="1.2"
                  />
                  {/* Right petal unfurling tip */}
                  <path
                    d="M 122 100 C 136 88 142 78 140 70 C 132 78 124 92 122 100 Z"
                    fill="#FAFAF5"
                    stroke="#8BA180"
                    strokeWidth="1.2"
                  />
                </g>
              )}

              {/* FULL BLOOM WITH GOLDEN HALO (Phase 2 & 3) */}
              {(phase === 2 || phase === 3) && (
                <g
                  className={`transition-all duration-1000 ease-out origin-[120px_100px] ${
                    phase === 3 ? 'scale-105' : 'scale-100'
                  }`}
                >
                  {/* Golden central radiant circle */}
                  <circle cx="120" cy="100" r="28" fill="url(#loadingHaloGlow)" />

                  {/* Back Center Petal */}
                  <path
                    d="M 120 100 C 108 75 109 52 120 38 C 131 52 132 75 120 100 Z"
                    fill="#FAFCF6"
                    stroke="#94A58E"
                    strokeWidth="1.2"
                  />
                  {/* Back Petal Vein */}
                  <path d="M 120 95 Q 120 65 120 42" stroke="#DCE4D3" strokeWidth="1" />

                  {/* Left Back Petal */}
                  <path
                    d="M 118 100 C 96 84 78 76 66 73 C 74 90 94 102 118 100 Z"
                    fill="#FFFFFF"
                    stroke="#94A58E"
                    strokeWidth="1.2"
                  />

                  {/* Right Back Petal */}
                  <path
                    d="M 122 100 C 144 84 162 76 174 73 C 166 90 146 102 122 100 Z"
                    fill="#FFFFFF"
                    stroke="#94A58E"
                    strokeWidth="1.2"
                  />

                  {/* Front Flared Petals */}
                  <path
                    d="M 118 102 C 92 94 68 102 56 114 C 72 118 96 114 118 102 Z"
                    fill="#FFFFFF"
                    stroke="#6D8267"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M 122 102 C 148 94 172 102 184 114 C 168 118 144 114 122 102 Z"
                    fill="#FFFFFF"
                    stroke="#6D8267"
                    strokeWidth="1.3"
                  />

                  {/* Front Drooping Center Petal */}
                  <path
                    d="M 117 101 C 112 118 115 136 120 148 C 125 136 128 118 123 101 Z"
                    fill="#FFFFFF"
                    stroke="#6D8267"
                    strokeWidth="1.3"
                  />

                  {/* Pistil & Stamen cluster */}
                  <circle cx="120" cy="102" r="7" fill="#E9C46A" />

                  {/* Pollen Anthers */}
                  <path d="M 120 102 Q 114 88 110 78" stroke="#40916C" strokeWidth="1.2" />
                  <circle cx="110" cy="77" r="2.2" fill="#8A283B" />

                  <path d="M 120 102 Q 118 84 117 72" stroke="#40916C" strokeWidth="1.2" />
                  <circle cx="117" cy="71" r="2.2" fill="#9C3048" />

                  <path d="M 120 102 Q 123 84 125 72" stroke="#40916C" strokeWidth="1.2" />
                  <circle cx="125" cy="71" r="2.2" fill="#9C3048" />

                  <path d="M 120 102 Q 127 88 132 78" stroke="#40916C" strokeWidth="1.2" />
                  <circle cx="132" cy="77" r="2.2" fill="#8A283B" />
                </g>
              )}
            </g>
          </svg>
        </div>

        {/* Brand Name Typography */}
        <div className="mt-6 flex flex-col items-center">
          <h2
            className={`text-[28px] sm:text-[34px] font-bold tracking-[0.24em] text-[#2B2D2F] font-sans transition-all duration-700 ${
              phase >= 2 ? 'scale-105 text-[#1F2421]' : 'opacity-90'
            }`}
          >
            GLÜCK GIFY
          </h2>
          <p className="text-[11px] sm:text-[12px] tracking-[0.32em] text-[#4CAF50] font-semibold uppercase mt-1">
            Cute Gify and Accessories
          </p>
        </div>

        {/* Dynamic Status Text */}
        <p className="mt-5 text-[13px] text-[#556353] font-medium h-6 transition-all duration-500">
          {phaseStatusTexts[phase]}
        </p>

        {/* Aesthetic Progress Bar */}
        <div className="w-56 h-1.5 bg-[#E8EDE0] rounded-full mt-4 overflow-hidden relative">
          <div
            className="h-full bg-linear-to-r from-[#52B788] via-[#4CAF50] to-[#E9C46A] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[11px] text-[#869483] tracking-widest uppercase mt-2">
          {progress}% Bloom Complete
        </p>
      </div>

      {/* Footer Signature */}
      <div className="absolute bottom-6 flex items-center gap-2 text-[11px] tracking-wider text-[#818E7F] uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
        <span>Handcrafted Botanical Aesthetics</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#E9C46A]" />
      </div>
    </div>
  );
};
