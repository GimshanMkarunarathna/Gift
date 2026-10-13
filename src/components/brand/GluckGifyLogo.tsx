import React, { useState, useEffect } from 'react';

export const DESIGNATED_LOGO_PUBLIC_PATH = '/logo.png';
export const DESIGNATED_LOGO_ASSETS_PATH = 'src/assets/logo.png';

export interface GluckGifyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon-only';
  className?: string;
  showText?: boolean;
  animated?: boolean;
  glow?: boolean;
  customSrc?: string;
  forceVector?: boolean;
}

/**
 * GLÜCK GIFY Official Hybrid Logo
 * 
 * Supports:
 * 1. Dynamic custom image logo loaded from `/logo.png`, `src/assets/logo.png`,
 *    or admin-configured custom URL / base64 image.
 * 2. Graceful automatic fallback to the handcrafted scalable vector emblem if
 *    the custom image is missing or errors during load.
 * 3. Force-vector flag for pure SVG rendering.
 */
export const GluckGifyLogo: React.FC<GluckGifyLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  animated = false,
  glow = false,
  customSrc,
  forceVector = false,
}) => {
  const [imageFailed, setImageFailed] = useState<boolean>(false);
  const [activeImageSrc, setActiveImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (forceVector) {
      setActiveImageSrc(null);
      return;
    }

    // Determine active logo source:
    // 1. Explicit prop
    // 2. Admin localStorage custom logo
    // 3. Designated public placeholder '/logo.png'
    const storedCustom = typeof window !== 'undefined' ? localStorage.getItem('gluck_custom_logo') : null;
    const resolvedSrc = customSrc || storedCustom || DESIGNATED_LOGO_PUBLIC_PATH;

    setActiveImageSrc(resolvedSrc);
    setImageFailed(false);
  }, [customSrc, forceVector]);

  const sizeMap = {
    'icon-only': 'w-10 h-10',
    sm: 'w-10 h-10 sm:w-12 sm:h-12',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-28 h-28 sm:w-36 sm:h-36',
    xl: 'w-48 h-48 sm:w-60 sm:h-60',
  };

  const idSuffix = React.useId().replace(/:/g, '');

  // If a valid custom image exists and hasn't failed, render it gracefully
  if (activeImageSrc && !imageFailed && !forceVector) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${
          glow ? 'drop-shadow-[0_4px_16px_rgba(76,175,80,0.28)]' : ''
        } ${className}`}
      >
        <img
          src={activeImageSrc}
          alt="GLÜCK GIFY Logo"
          onError={() => setImageFailed(true)}
          className={`w-full h-full object-contain rounded-full select-none transition-transform duration-300 ${
            animated ? 'hover:scale-105' : ''
          }`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${
        glow ? 'drop-shadow-[0_4px_16px_rgba(76,175,80,0.28)]' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
      >
        <defs>
          {/* Circular text paths */}
          {/* Top text path arched upwards */}
          <path
            id={`topPath-${idSuffix}`}
            d="M 55,200 A 145,145 0 0,1 345,200"
            fill="none"
          />
          {/* Bottom text path arched downwards */}
          <path
            id={`bottomPath-${idSuffix}`}
            d="M 345,200 A 145,145 0 0,1 55,200"
            fill="none"
          />

          {/* Gradients for lily petals */}
          <radialGradient id={`petalGlow-${idSuffix}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFC" />
            <stop offset="65%" stopColor="#F7F8F0" />
            <stop offset="100%" stopColor="#E2E8D8" />
          </radialGradient>

          {/* Stem & leaf rich lily green gradient */}
          <linearGradient id={`stemGreen-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#52B788" />
            <stop offset="50%" stopColor="#38734C" />
            <stop offset="100%" stopColor="#2D6A4F" />
          </linearGradient>

          {/* Flower throat soft gold/pistil */}
          <linearGradient id={`throatGlow-${idSuffix}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#E9C46A" />
            <stop offset="70%" stopColor="#D4E09B" />
            <stop offset="100%" stopColor="#F9FAF4" />
          </linearGradient>
        </defs>

        {/* Outer Circular Boundary */}
        <circle
          cx="200"
          cy="200"
          r="190"
          fill="#FFFFFF"
          stroke="#2B2D2F"
          strokeWidth="2.5"
          className="transition-colors"
        />

        {showText && (
          <>
            {/* Top Arched Text: GLÜCK GIFY */}
            <text
              fill="#2B2D2F"
              fontSize="29"
              fontFamily="'Manrope', -apple-system, sans-serif"
              fontWeight="600"
              letterSpacing="0.22em"
              textAnchor="middle"
            >
              <textPath
                href={`#topPath-${idSuffix}`}
                startOffset="50%"
                textAnchor="middle"
              >
                GLÜCK GIFY
              </textPath>
            </text>

            {/* Left 4-pointed sparkle star */}
            <g transform="translate(90, 126)">
              <path
                d="M 0,-12 Q 1,-2 12,0 Q 1,2 0,12 Q -1,2 -12,0 Q -1,-2 0,-12 Z"
                fill="#2B2D2F"
              />
            </g>

            {/* Right 4-pointed sparkle star */}
            <g transform="translate(310, 126)">
              <path
                d="M 0,-12 Q 1,-2 12,0 Q 1,2 0,12 Q -1,2 -12,0 Q -1,-2 0,-12 Z"
                fill="#2B2D2F"
              />
            </g>

            {/* Bottom Arched Text: CUTE GIFY AND ACCESSORIES */}
            <text
              fill="#2B2D2F"
              fontSize="16.5"
              fontFamily="'Manrope', -apple-system, sans-serif"
              fontWeight="500"
              letterSpacing="0.26em"
              textAnchor="middle"
            >
              <textPath
                href={`#bottomPath-${idSuffix}`}
                startOffset="50%"
                textAnchor="middle"
              >
                CUTE GIFY AND ACCESSORIES
              </textPath>
            </text>
          </>
        )}

        {/* Center Botanical White Lily Illustration */}
        <g
          id="centerLily"
          className={animated ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}
        >
          {/* Main Stem */}
          <path
            d="M 193 300 Q 192 235 198 165 Q 199 155 201 145"
            stroke={`url(#stemGreen-${idSuffix})`}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Left Leaf curving gracefully */}
          <path
            d="M 194 245 C 172 235 162 208 166 195 C 176 210 188 226 194 233 Z"
            fill={`url(#stemGreen-${idSuffix})`}
            stroke="#2B2D2F"
            strokeWidth="0.8"
          />
          {/* Left Leaf Midrib */}
          <path
            d="M 194 245 Q 176 222 168 198"
            stroke="#204E38"
            strokeWidth="0.8"
            fill="none"
          />

          {/* Right Leaf curving outwards */}
          <path
            d="M 196 255 C 215 250 238 238 244 230 C 235 240 215 252 196 255 Z"
            fill={`url(#stemGreen-${idSuffix})`}
            stroke="#2B2D2F"
            strokeWidth="0.8"
          />

          {/* Central Blooming Lily Flower Petals */}
          {/* Back Petal 1 - Top Center */}
          <path
            d="M 200 155 C 185 125 186 95 200 78 C 214 95 215 125 200 155 Z"
            fill="#F6F7F0"
            stroke="#A3B19B"
            strokeWidth="1.2"
          />
          {/* Back Petal Vein */}
          <path
            d="M 200 150 Q 200 110 200 84"
            stroke="#D6DFC9"
            strokeWidth="1"
            fill="none"
          />

          {/* Left Back Petal */}
          <path
            d="M 197 155 C 172 135 150 126 136 122 C 146 142 170 158 197 155 Z"
            fill="#FAFBF5"
            stroke="#9BAA93"
            strokeWidth="1.2"
          />

          {/* Right Back Petal */}
          <path
            d="M 203 155 C 228 135 250 126 264 122 C 254 142 230 158 203 155 Z"
            fill="#FAFBF5"
            stroke="#9BAA93"
            strokeWidth="1.2"
          />

          {/* Front Left Outer Flared Petal */}
          <path
            d="M 198 158 C 170 148 142 158 128 172 C 146 178 174 172 198 158 Z"
            fill="#FFFFFF"
            stroke="#7D8F75"
            strokeWidth="1.2"
          />

          {/* Front Right Outer Flared Petal */}
          <path
            d="M 202 158 C 230 148 258 158 272 172 C 254 178 226 172 202 158 Z"
            fill="#FFFFFF"
            stroke="#7D8F75"
            strokeWidth="1.2"
          />

          {/* Front Drooping Center Petal */}
          <path
            d="M 196 156 C 190 178 194 200 200 216 C 206 200 210 178 204 156 Z"
            fill="#FFFFFF"
            stroke="#7D8F75"
            strokeWidth="1.2"
          />

          {/* Delicate Petal Highlights & Inner Creases */}
          <path
            d="M 200 162 Q 200 188 200 208"
            stroke="#D2DEC5"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M 195 160 Q 165 162 140 170"
            stroke="#D2DEC5"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 205 160 Q 235 162 260 170"
            stroke="#D2DEC5"
            strokeWidth="1"
            fill="none"
          />

          {/* Flower Throat / Pistil with Soft Lime-Gold Radiance */}
          <circle cx="200" cy="158" r="9" fill={`url(#throatGlow-${idSuffix})`} />

          {/* Botanical Stamens with Reddish/Cranberry Pollen Anthers */}
          {/* Stamen 1 */}
          <path d="M 200 158 Q 192 142 188 132" stroke="#688457" strokeWidth="1.2" fill="none" />
          <ellipse cx="187" cy="130" rx="3.5" ry="1.8" transform="rotate(-30 187 130)" fill="#8A283B" />

          {/* Stamen 2 */}
          <path d="M 200 158 Q 197 138 196 126" stroke="#688457" strokeWidth="1.2" fill="none" />
          <ellipse cx="196" cy="124" rx="1.8" ry="3.5" fill="#9C3048" />

          {/* Stamen 3 */}
          <path d="M 200 158 Q 204 138 208 127" stroke="#688457" strokeWidth="1.2" fill="none" />
          <ellipse cx="209" cy="125" rx="1.8" ry="3.5" fill="#9C3048" />

          {/* Stamen 4 */}
          <path d="M 200 158 Q 209 144 216 134" stroke="#688457" strokeWidth="1.2" fill="none" />
          <ellipse cx="217" cy="132" rx="3.5" ry="1.8" transform="rotate(30 217 132)" fill="#8A283B" />

          {/* Central Stigma (Pistil tip) */}
          <path d="M 200 158 L 201 138" stroke="#3D754C" strokeWidth="1.6" fill="none" />
          <circle cx="201" cy="136" r="2.2" fill="#52B788" />
        </g>
      </svg>
    </div>
  );
};
