'use client';

import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';
import { products } from '@/lib/mock-data';

interface OutfitSuggestionsProps {
  product: Product;
}

export default function OutfitSuggestions({ product }: OutfitSuggestionsProps) {
  const outfitSuggestions = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mt-16">
      <h2 className="mb-8 text-center font-headline text-3xl font-bold">Complete Your Look</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {outfitSuggestions.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
