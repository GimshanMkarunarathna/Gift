export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number; // In LKR
  formattedPrice: string; // e.g. "LKR 3,499"
  rating: number;
  reviewCount: number;
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'accent' | 'tertiary';
  featureTag?: string; // e.g. "Free Wrapping", "Laser Engraved", "Same-day Delivery"
  image: string;
  imageAlt: string;
  category: string;
  occasion: string[];
  vibe: string[];
  isPersonalizable?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  personalization?: {
    recipientName?: string;
    message?: string;
    waxSealColor?: string;
    fontStyle?: string;
  };
}

export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

export interface CategoryItem {
  id: string;
  name: string;
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'accent';
  image: string;
  imageAlt: string;
  slug: string;
}

export interface OccasionItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  slug: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  location: string;
  giftTag: string;
  rating: number;
}

export interface InstagramPost {
  id: string;
  image: string;
  alt: string;
}

export interface PersonalizationData {
  recipientName: string;
  message: string;
  waxSealColor: string;
  fontStyle: string;
  ribbonColor: string;
}
