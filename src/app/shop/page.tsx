'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, categories } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/hooks/use-language';

const uniqueSizes = [...new Set(products.flatMap(p => p.variants.map(v => v.size)))];
const uniqueColors = [...new Set(products.flatMap(p => p.variants.map(v => v.colorName)))];


const Filters = () => {
    const { t } = useLanguage();
    const [priceRange, setPriceRange] = useState([0, 500]);
    return (
        <div className="space-y-6">
            <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
                <AccordionItem value="category">
                    <AccordionTrigger>{t('filter.category')}</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid gap-2">
                        {categories.map((category) => (
                             <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox id={`cat-${category.id}`} />
                                <label
                                    htmlFor={`cat-${category.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t(`filter.${category.id}`)}
                                </label>
                            </div>
                        ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                    <AccordionTrigger>{t('filter.price')}</AccordionTrigger>
                    <AccordionContent>
                        <div className="p-2">
                           <Slider
                                defaultValue={[500]}
                                max={500}
                                step={10}
                                onValueChange={(value) => setPriceRange([0, value[0]])}
                            />
                            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                                <span>$0</span>
                                <span>${priceRange[1]}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="size">
                    <AccordionTrigger>{t('filter.size')}</AccordionTrigger>
                    <AccordionContent>
                       <div className="grid grid-cols-3 gap-2">
                            {uniqueSizes.map((size) => (
                                <Button key={size} variant="outline" size="sm">{size}</Button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="color">
                    <AccordionTrigger>{t('filter.color')}</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                            {uniqueColors.map((color) => (
                                <Button key={color} variant="outline" size="sm">{color}</Button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};


export default function ShopPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [sortOption, setSortOption] = useState('newest');

  const categoryParam = searchParams.get('category');
  const pageTitle = categoryParam 
    ? categories.find(c => c.id === categoryParam)?.name || t('shop.title')
    : t('shop.all_products');

  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    if (sortOption === 'price_low_high') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price_high_low') {
      sorted.sort((a, b) => b.price - a.price);
    } else { // newest
      // Assuming mock data is already sorted by newest, or we could add a date property
    }
    return sorted;
  }, [filteredProducts, sortOption]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">{pageTitle}</h1>
        <p className="text-muted-foreground">{t('shop.browse_collection')}</p>
      </div>
      <div className="flex">
        <aside className="hidden w-64 pr-8 lg:block">
            <h2 className="text-xl font-headline font-semibold mb-4">{t('shop.filters')}</h2>
            <Filters />
        </aside>
        <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
             <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <ScrollArea className="h-full pr-4">
                    <h2 className="text-xl font-headline font-semibold mb-4">{t('shop.filters')}</h2>
                    <Filters />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
            <p className="text-sm text-muted-foreground">{sortedProducts.length} products</p>
            <Select onValueChange={setSortOption} defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('filter.sort_by')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('sort.newest')}</SelectItem>
                <SelectItem value="price_low_high">{t('sort.price_low_high')}</SelectItem>
                <SelectItem value="price_high_low">{t('sort.price_high_low')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline">{t('shop.load_more')}</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
