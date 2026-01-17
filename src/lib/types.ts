export type Language = 'en' | 'fr' | 'ht';
export type Currency = 'USD' | 'EUR' | 'HTG';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  images: string[];
  imageHints: string[];
  price: number;
  category: string;
  tags: string[];
  variants: Variant[];
  rating: number;
  reviewCount: number;
  status: 'draft' | 'published' | 'archived';
};

export type Variant = {
  id: string;
  color: string;
  colorName: string;
  size: string;
  stock: number;
  imageUrl?: string;
};

export type Category = {
  id: string;
  nameKey: string;
  imageUrl: string;
  imageHint: string;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  avatarUrl: string;
  rating: number;
  textKey: string;
  date: string;
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
};

export type WishlistItem = {
  productId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  language: Language;
};

export type Avatar = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type SavedOutfit = {
  id: string;
  name: string;
  date: string;
  items: Product[];
  imageUrl: string;
};