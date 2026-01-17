import type { Category, Review, Avatar } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const img = PlaceHolderImages.find((p) => p.id === id);
  return img ? { url: img.imageUrl, hint: img.imageHint } : { url: 'https://placehold.co/600x400', hint: 'placeholder' };
};


export const categories: Category[] = [
  { id: 'clothing', nameKey: 'filter.clothing', imageUrl: getImage('cat-clothes').url, imageHint: getImage('cat-clothes').hint },
  { id: 'shoes', nameKey: 'filter.shoes', imageUrl: getImage('cat-shoes').url, imageHint: getImage('cat-shoes').hint },
  { id: 'accessories', nameKey: 'filter.accessories', imageUrl: getImage('cat-accessories').url, imageHint: getImage('cat-accessories').hint },
  { id: 'tech', nameKey: 'filter.tech', imageUrl: getImage('cat-tech').url, imageHint: getImage('cat-tech').hint },
];

export const reviews: Review[] = [
  {
    id: '1',
    productId: 'elegant-white-summer-dress',
    author: 'Sophie L.',
    avatarUrl: getImage('review-avatar-1').url,
    rating: 5,
    textKey: 'review.product1.sophie',
    date: '2023-08-15',
  },
  {
    id: '2',
    productId: 'classic-black-leather-jacket',
    author: 'Marc-Antoine P.',
    avatarUrl: getImage('review-avatar-2').url,
    rating: 5,
    textKey: 'review.product2.marc',
    date: '2023-09-01',
  },
  {
    id: '3',
    productId: 'white-leather-sneakers',
    author: 'Jessica B.',
    avatarUrl: getImage('review-avatar-3').url,
    rating: 4,
    textKey: 'review.product7.jessica',
    date: '2023-08-22',
  },
];

export const avatars: Avatar[] = [
  { id: 'avatar-1', description: 'Slender build, female', imageUrl: getImage('avatar-1').url, imageHint: getImage('avatar-1').hint },
  { id: 'avatar-2', description: 'Athletic build, male', imageUrl: getImage('avatar-2').url, imageHint: getImage('avatar-2').hint },
  { id: 'avatar-3', description: 'Curvy build, female', imageUrl: getImage('avatar-3').url, imageHint: getImage('avatar-3').hint },
  { id: 'avatar-4', description: 'Broad build, male', imageUrl: getImage('avatar-4').url, imageHint: getImage('avatar-4').hint },
];
