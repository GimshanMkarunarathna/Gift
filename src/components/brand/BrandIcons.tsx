import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  accentColor?: string;
}

/**
 * 1. Stylized Lily Flower Icon (General Gify)
 * Hand-drawn clean vector style with white petals, green stem & leaves.
 */
export const LilyFlowerIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  color = '#2B2D2F',
  accentColor = '#4CAF50',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Stem */}
    <path
      d="M16 28V16"
      stroke={accentColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Leaves */}
    <path
      d="M16 23C13 22 10.5 19.5 11 18C13 19 15 21 16 22"
      fill={accentColor}
      stroke={color}
      strokeWidth="0.8"
    />
    <path
      d="M16 24C19 23.5 21.5 21.5 21 20C19.5 20.8 17.5 22.5 16 23.5"
      fill={accentColor}
      stroke={color}
      strokeWidth="0.8"
    />
    {/* Back Petals */}
    <path
      d="M16 16C14 13 14 9.5 16 7C18 9.5 18 13 16 16Z"
      fill="#FFFFFF"
      stroke={color}
      strokeWidth="1.2"
    />
    <path
      d="M15.5 16C12.5 14 9.5 13 8 12.5C9.5 14.5 12.5 16 15.5 16Z"
      fill="#F9FAF5"
      stroke={color}
      strokeWidth="1.2"
    />
    <path
      d="M16.5 16C19.5 14 22.5 13 24 12.5C22.5 14.5 19.5 16 16.5 16Z"
      fill="#F9FAF5"
      stroke={color}
      strokeWidth="1.2"
    />
    {/* Front Flared Petals */}
    <path
      d="M15 16.5C11.5 16 8.5 17.5 7.5 19C10 19.5 13 18.5 15 16.5Z"
      fill="#FFFFFF"
      stroke={color}
      strokeWidth="1.2"
    />
    <path
      d="M17 16.5C20.5 16 23.5 17.5 24.5 19C22 19.5 19 18.5 17 16.5Z"
      fill="#FFFFFF"
      stroke={color}
      strokeWidth="1.2"
    />
    {/* Center Droop Petal */}
    <path
      d="M15.5 16.5C15 19 15.5 21 16 22C16.5 21 17 19 16.5 16.5Z"
      fill="#FFFFFF"
      stroke={color}
      strokeWidth="1.2"
    />
    {/* Pollen Anthers */}
    <circle cx="14.5" cy="12" r="0.9" fill="#8A283B" />
    <circle cx="16" cy="11" r="0.9" fill="#8A283B" />
    <circle cx="17.5" cy="12" r="0.9" fill="#8A283B" />
  </svg>
);

/**
 * 2. Ribbon & Gift Box Icon (Gifts)
 * Cartoon clean ribbon bow and gift box with lily green wrapping.
 */
export const GiftRibbonIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  color = '#2B2D2F',
  accentColor = '#4CAF50',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Gift Box Base */}
    <rect
      x="7"
      y="15"
      width="18"
      height="12"
      rx="2"
      fill="#FAF9F6"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Box Lid */}
    <rect
      x="5.5"
      y="11.5"
      width="21"
      height="4.5"
      rx="1.5"
      fill="#FFFFFF"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Vertical Ribbon */}
    <rect
      x="14.5"
      y="11.5"
      width="3"
      height="15.5"
      fill={accentColor}
      stroke={color}
      strokeWidth="1"
    />
    {/* Ribbon Bow Left */}
    <path
      d="M16 11.5C13 8 9 9 10 11.5C11 13 14.5 12 16 11.5Z"
      fill={accentColor}
      stroke={color}
      strokeWidth="1.2"
    />
    {/* Ribbon Bow Right */}
    <path
      d="M16 11.5C19 8 23 9 22 11.5C21 13 17.5 12 16 11.5Z"
      fill={accentColor}
      stroke={color}
      strokeWidth="1.2"
    />
    {/* Ribbon Knot */}
    <circle cx="16" cy="11.5" r="1.6" fill="#FFFFFF" stroke={color} strokeWidth="1" />
  </svg>
);

/**
 * 3. Sparkling Star Icon (Favorites / Glow)
 * Four-pointed stylized star matching the logo.
 */
export const SparkleStarIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  color = '#2B2D2F',
  accentColor = '#E9C46A',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    <path
      d="M16 4 Q 17.5 13.5 27 16 Q 17.5 18.5 16 28 Q 14.5 18.5 5 16 Q 14.5 13.5 16 4 Z"
      fill={accentColor}
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="16" r="2" fill="#FFFFFF" />
  </svg>
);

/**
 * 4. Minimalist Backpack & Pouch Icon (Accessories)
 * Clean cute atelier backpack with flap and buckle.
 */
export const CuteBackpackIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  color = '#2B2D2F',
  accentColor = '#4CAF50',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Top handle loop */}
    <path
      d="M12 9C12 6.5 14 5 16 5C18 5 20 6.5 20 9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Main Bag Body */}
    <rect
      x="7"
      y="9"
      width="18"
      height="18"
      rx="4"
      fill="#FAF9F6"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Bag Flap */}
    <path
      d="M7 13C7 11 9 9 11 9H21C23 9 25 11 25 13V16C25 18 23 19 21 19H11C9 19 7 18 7 16V13Z"
      fill="#FFFFFF"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Front Pocket */}
    <rect
      x="10"
      y="20"
      width="12"
      height="6"
      rx="2"
      fill="#FFFFFF"
      stroke={color}
      strokeWidth="1.2"
    />
    {/* Lily green clasp/buckle */}
    <rect x="14.5" y="16.5" width="3" height="3.5" rx="1" fill={accentColor} stroke={color} strokeWidth="1" />
  </svg>
);

/**
 * 5. Search Magnifying Glass Icon (Search)
 * Clean aesthetic glass with cute lily leaf handle accent.
 */
export const CuteSearchIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  color = '#2B2D2F',
  accentColor = '#4CAF50',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Glass Circle */}
    <circle
      cx="14"
      cy="14"
      r="7.5"
      fill="#FFFFFF"
      stroke={color}
      strokeWidth="1.8"
    />
    {/* Inner Glass Glisten */}
    <path
      d="M10 11C10.8 9.8 12.2 9 14 9"
      stroke="#D2DEC5"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    {/* Handle */}
    <path
      d="M19.5 19.5L26 26"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Lily leaf accent on handle */}
    <path
      d="M21 21C22.5 19.5 24 20.5 23.5 22C23 22.8 22 22 21 21Z"
      fill={accentColor}
      stroke={color}
      strokeWidth="0.8"
    />
  </svg>
);
