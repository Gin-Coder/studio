
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { products, reviews } from '@/lib/mock-data';
import { Star, Truck, ShieldCheck } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ProductCard from '@/components/ProductCard';
import ProductActions from './ProductActions';
import OutfitSuggestions from './OutfitSuggestions';
import VirtualTryOn from './VirtualTryOn';
import ProductPrice from './ProductPrice';
import { useLanguage } from '@/hooks/use-language';
import type { Product } from '@/lib/types';


function ProductDetailClient({ product }: { product: Product }) {
  const { t } = useLanguage();

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
     <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Gallery */}
        <div className="aspect-[3/4] relative">
           <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="rounded-lg object-cover shadow-lg"
            data-ai-hint={product.imageHints[0]}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="font-headline text-3xl font-bold lg:text-4xl">{product.name}</h1>
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

      <OutfitSuggestions product={product} />

      <div className="mt-16">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold">{t('product.you_might_also_like')}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <div id="reviews" className="mt-16">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold">{t('product.customer_reviews')}</h2>
        <div className="mx-auto max-w-3xl space-y-8">
          {reviews.filter(r => r.productId === product.id).map(review => (
             <div key={review.id} className="rounded-lg border p-6">
               <div className="flex items-start">
                  <Image src={review.avatarUrl} alt={review.author} width={48} height={48} className="rounded-full" />
                  <div className="ml-4">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{review.author}</p>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="mt-2 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-accent text-accent'
                              : 'fill-muted text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 italic text-muted-foreground">"{t(review.textKey)}"</p>
                  </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }
  
  // We pass the server-fetched product data to the client component
  return <ProductDetailClient product={product} />;
}
