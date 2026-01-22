import type { Category, Avatar } from './types';
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

export const avatars: Avatar[] = [
  { id: 'avatar-1', description: 'Slender build, female', imageUrl: getImage('avatar-1').url, imageHint: getImage('avatar-1').hint },
  { id: 'avatar-2', description: 'Athletic build, male', imageUrl: getImage('avatar-2').url, imageHint: getImage('avatar-2').hint },
  { id: 'avatar-3', description: 'Curvy build, female', imageUrl: getImage('avatar-3').url, imageHint: getImage('avatar-3').hint },
  { id: 'avatar-4', description: 'Broad build, male', imageUrl: getImage('avatar-4').url, imageHint: getImage('avatar-4').hint },
];
