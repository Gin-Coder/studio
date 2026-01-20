
import { collection, doc, writeBatch, Firestore, serverTimestamp } from 'firebase/firestore';
import { categories } from './mock-data';
import { PlaceHolderImages } from './placeholder-images';
import type { Product } from './types';


const getImage = (id: string) => {
  const img = PlaceHolderImages.find((p) => p.id === id);
  return img ? { url: img.imageUrl, hint: img.imageHint } : { url: 'https://placehold.co/600x400', hint: 'placeholder' };
};

const products: Omit<Product, 'id'>[] = [
  {
    slug: 'elegant-white-summer-dress',
    name: 'Elegant White Summer Dress',
    description: 'A light and airy white dress, perfect for summer days and beach outings.',
    longDescription: 'Crafted from breathable cotton, this elegant white summer dress features a flowing silhouette and delicate lace details. It\'s the perfect choice for warm weather, offering both comfort and style. Whether you\'re strolling on the beach or attending a garden party, this dress will make you feel effortlessly chic.',
    images: [getImage('prod-1').url],
    imageHints: [getImage('prod-1').hint],
    price: 79.99,
    category: 'clothing',
    status: 'published',
    tags: ['summer', 'dress', 'white'],
    variants: [
      { id: '1-s', color: '#FFFFFF', colorName: 'White', size: 'S', stock: 15 },
      { id: '1-m', color: '#FFFFFF', colorName: 'White', size: 'M', stock: 10 },
      { id: '1-l', color: '#FFFFFF', colorName: 'White', size: 'L', stock: 5 },
    ],
    rating: 4.8,
    reviewCount: 25,
  },
  {
    slug: 'classic-black-leather-jacket',
    name: 'Classic Black Leather Jacket',
    description: 'A timeless black leather jacket that adds a touch of edge to any outfit.',
    longDescription: 'This classic black leather jacket is a wardrobe staple. Made from genuine high-quality leather, it features a tailored fit, asymmetrical zip closure, and silver-tone hardware. It\'s versatile enough to be dressed up or down, making it an essential piece for any season.',
    images: [getImage('prod-2').url],
    imageHints: [getImage('prod-2').hint],
    price: 249.99,
    category: 'clothing',
    status: 'published',
    tags: ['jacket', 'leather', 'black'],
    variants: [
      { id: '2-m', color: '#000000', colorName: 'Black', size: 'M', stock: 8 },
      { id: '2-l', color: '#000000', colorName: 'Black', size: 'L', stock: 12 },
      { id: '2-xl', color: '#000000', colorName: 'Black', size: 'XL', stock: 7 },
    ],
    rating: 4.9,
    reviewCount: 42,
  },
  {
    slug: 'white-leather-sneakers',
    name: 'White Leather Sneakers',
    description: 'Clean and minimalist white leather sneakers for a fresh, modern look.',
    longDescription: 'Elevate your casual footwear with these minimalist white leather sneakers. Featuring a clean design, premium leather upper, and a durable rubber sole, they offer both style and comfort. Perfect for everyday wear, they pair effortlessly with everything from jeans to dresses.',
    images: [getImage('prod-7').url],
    imageHints: [getImage('prod-7').hint],
    price: 119.99,
    category: 'shoes',
    status: 'published',
    tags: ['sneakers', 'white', 'leather'],
    variants: [
      { id: '7-39', color: '#FFFFFF', colorName: 'White', size: '39', stock: 20 },
      { id: '7-40', color: '#FFFFFF', colorName: 'White', size: '40', stock: 18 },
      { id: '7-41', color: '#FFFFFF', colorName: 'White', size: '41', stock: 15 },
      { id: '7-42', color: '#FFFFFF', colorName: 'White', size: '42', stock: 12 },
    ],
    rating: 4.7,
    reviewCount: 58,
  },
  {
    slug: 'gold-analog-watch',
    name: 'Gold Analog Watch',
    description: 'An elegant gold analog watch that combines classic design with modern sophistication.',
    longDescription: 'This beautifully crafted gold analog watch is a symbol of timeless elegance. It features a polished gold-tone stainless steel case, a minimalist dial with sleek hour markers, and a comfortable mesh strap. It\'s a sophisticated accessory for any occasion.',
    images: [getImage('prod-11').url],
    imageHints: [getImage('prod-11').hint],
    price: 189.99,
    category: 'accessories',
    status: 'published',
    tags: ['watch', 'gold', 'accessory'],
    variants: [
      { id: '11-std', color: '#FFD700', colorName: 'Gold', size: 'One Size', stock: 25 },
    ],
    rating: 4.9,
    reviewCount: 33,
  },
  {
    slug: 'wireless-over-ear-headphones',
    name: 'Wireless Over-Ear Headphones',
    description: 'Immerse yourself in high-fidelity sound with these comfortable wireless headphones.',
    longDescription: 'Experience superior sound quality and all-day comfort with these wireless over-ear headphones. They feature noise-cancellation technology, a long-lasting battery, and plush earcups. Whether you\'re listening to music, podcasts, or taking calls, these headphones deliver an exceptional audio experience.',
    images: [getImage('prod-15').url],
    imageHints: [getImage('prod-15').hint],
    price: 199.99,
    category: 'tech',
    status: 'draft',
    tags: ['headphones', 'tech', 'black'],
    variants: [
      { id: '15-std-black', color: '#000000', colorName: 'Black', size: 'One Size', stock: 30 },
      { id: '15-std-white', color: '#FFFFFF', colorName: 'White', size: 'One Size', stock: 22 },
    ],
    rating: 4.8,
    reviewCount: 61,
  },
];

export async function seedDatabase(db: Firestore) {
  const batch = writeBatch(db);

  // Seed categories
  const categoriesCollection = collection(db, 'categories');
  categories.forEach((category) => {
    const categoryRef = doc(categoriesCollection, category.id);
    batch.set(categoryRef, category);
  });
  console.log('Seeding categories...');

  // Seed products
  const productsCollection = collection(db, 'products');
  products.forEach((product) => {
    const productRef = doc(productsCollection); // Auto-generate ID
    batch.set(productRef, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  console.log('Seeding products...');

  // Commit the batch
  await batch.commit();
  console.log('Database seeded successfully!');
}
