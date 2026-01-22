
'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Truck, ShieldCheck } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ProductActions from './ProductActions';
import OutfitSuggestions from './OutfitSuggestions';
import VirtualTryOn from './VirtualTryOn';
import ProductPrice from './ProductPrice';
import ReviewSection from './ReviewSection';
import { useLanguage } from '@/hooks/use-language';
import type { Product } from '@/lib/types';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <Skeleton className="aspect-[3/4] rounded-lg" />
        <div className="flex flex-col">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4 mt-4" />
          <Skeleton className="h-8 w-1/3 mt-4" />
          <Skeleton className="h-12 w-full mt-8" />
           <div className="mt-8 space-y-4">
             <Skeleton className="h-6 w-full" />
             <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </div>
  </div>
)

function ProductDetailClient({ product }: { product: Product }) {
  const { t } = useLanguage();

  return (
     <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Gallery */}
        <div className="aspect-[3/4] relative">
           <Image
            src={product.images[0]}
            alt={t(product.nameKey)}
            fill
            className="rounded-lg object-cover shadow-lg"
            data-ai-hint={product.imageHints[0]}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="font-headline text-3xl font-bold lg:text-4xl">{t(product.nameKey)}</h1>
          
          {/* This will be managed by ReviewSection now */}
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.rating)
                      ? 'fill-accent text-accent'
                      : 'fill-muted text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <a href="#reviews" className="text-sm text-muted-foreground hover:underline">
                {t('product.reviews_link', { count: product.reviewCount })}
            </a>
          </div>

          <ProductPrice price={product.price} />
          <p className="mt-4 text-muted-foreground">{t(product.descriptionKey)}</p>
          
          <ProductActions product={product} />
          
          <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-primary" />
                <p className="text-sm">{t('product.delivery_info')}</p>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <p className="text-sm">{t('product.quality_guarantee')}</p>
              </div>
          </div>

          <div className="mt-8">
            <Accordion type="single" collapsible defaultValue="description">
              <AccordionItem value="description">
                <AccordionTrigger>{t('product.description')}</AccordionTrigger>
                <AccordionContent>{t(product.longDescriptionKey)}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="details">
                <AccordionTrigger>{t('product.details_care')}</AccordionTrigger>
                <AccordionContent>
                  <span dangerouslySetInnerHTML={{ __html: t('product.details_care_content') }} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      
      <VirtualTryOn />

      {/* Related Products: Outfit Suggestions */}
      {/* Note: This logic will be simplified or could be improved with a more advanced query in a real app */}
      <OutfitSuggestionsWrapper product={product} />

      {/* Reviews Section */}
      <ReviewSection productId={product.id} productNameKey={product.nameKey} />
    </div>
  );
}

// Wrapper to fetch categories for OutfitSuggestions
function OutfitSuggestionsWrapper({ product }: { product: Product }) {
    const firestore = useFirestore();
    const categoriesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'categories') : null), [firestore]);
    const { data: categories } = useCollection(categoriesQuery);
    const categoryMap = useMemo(() => {
        if (!categories) return new Map<string, string>();
        return new Map(categories.map(cat => [cat.id, cat.nameKey]));
    }, [categories]);

    return <OutfitSuggestions product={product} categoryMap={categoryMap} />;
}


export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  const productQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, 'products'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  const { data: liveProducts, isLoading } = useCollection<Product>(productQuery);

  const product = liveProducts?.[0];

  if (isLoading && !product) {
    return <ProductDetailSkeleton />;
  }
  
  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
