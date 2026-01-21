
'use client';

import ProductCard from '@/components/ProductCard';
import type { Product, Category } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/use-language';

interface OutfitSuggestionsProps {
  product: Product;
  categoryMap: Map<string, string>;
}

export default function OutfitSuggestions({ product, categoryMap }: OutfitSuggestionsProps) {
    const firestore = useFirestore();
    const { t } = useLanguage();
    const suggestionsQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'products'), where('category', '==', product.category), where('status', '==', 'published'), limit(5)) : null),
        [firestore, product.category]
    );

    const { data: suggestions, isLoading } = useCollection<Product>(suggestionsQuery);

    const outfitSuggestions = suggestions?.filter(p => p.id !== product.id).slice(0, 4) || [];


  return (
    <div className="mt-16">
      <h2 className="mb-8 text-center font-headline text-3xl font-bold">{t('product.outfit_suggestions')}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {isLoading && [...Array(4)].map((_, i) => <Skeleton key={i} className="h-[400px] w-full" />)}
        {!isLoading && outfitSuggestions.map(p => (
          <ProductCard key={p.id} product={p} categoryMap={categoryMap} />
        ))}
      </div>
    </div>
  );
}
