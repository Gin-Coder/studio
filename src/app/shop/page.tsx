
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, categories } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
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

type FilterState = {
    categories: string[];
    price: number;
    sizes: string[];
    colors: string[];
}

const Filters = ({ filters, setFilters }: { filters: FilterState, setFilters: React.Dispatch<React.SetStateAction<FilterState>> }) => {
    const { t } = useLanguage();

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            categories: checked
                ? [...prev.categories, categoryId]
                : prev.categories.filter(c => c !== categoryId)
        }));
    };

    const handleSizeChange = (size: string) => {
        setFilters(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };
    
    const handleColorChange = (color: string) => {
        setFilters(prev => ({
            ...prev,
            colors: prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color]
        }));
    };

    return (
        <div className="space-y-6">
            <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
                <AccordionItem value="category">
                    <AccordionTrigger>{t('filter.category')}</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid gap-2">
                        {categories.map((category) => (
                             <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`cat-${category.id}`} 
                                    checked={filters.categories.includes(category.id)}
                                    onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
                                />
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
                                value={[filters.price]}
                                max={500}
                                step={10}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, price: value[0] }))}
                            />
                            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                                <span>$0</span>
                                <span>${filters.price}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="size">
                    <AccordionTrigger>{t('filter.size')}</AccordionTrigger>
                    <AccordionContent>
                       <div className="grid grid-cols-3 gap-2">
                            {uniqueSizes.map((size) => (
                                <Button 
                                    key={size} 
                                    variant={filters.sizes.includes(size) ? "default" : "outline"} 
                                    size="sm"
                                    onClick={() => handleSizeChange(size)}
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="color">
                    <AccordionTrigger>{t('filter.color')}</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                            {uniqueColors.map((color) => (
                                <Button 
                                    key={color} 
                                    variant={filters.colors.includes(color) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleColorChange(color)}
                                >
                                    {color}
                                </Button>
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
  const categoryParam = searchParams.get('category');
  
  const [filters, setFilters] = useState<FilterState>({
    categories: categoryParam ? [categoryParam] : [],
    price: 500,
    sizes: [],
    colors: []
  });
  const [sortOption, setSortOption] = useState('newest');

  const pageTitle = useMemo(() => {
    if (filters.categories.length === 1) {
        const category = categories.find(c => c.id === filters.categories[0]);
        return t(`filter.${category?.id || ''}`) || t('shop.all_products');
    }
    return t('shop.all_products');
  }, [filters.categories, t]);


  const filteredProducts = useMemo(() => {
    return products.filter(product => {
        const categoryMatch = filters.categories.length === 0 || filters.categories.includes(product.category);
        const priceMatch = product.price <= filters.price;
        const sizeMatch = filters.sizes.length === 0 || product.variants.some(v => filters.sizes.includes(v.size));
        const colorMatch = filters.colors.length === 0 || product.variants.some(v => filters.colors.includes(v.colorName));
        return categoryMatch && priceMatch && sizeMatch && colorMatch;
    });
  }, [filters]);

  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    if (sortOption === 'price_low_high') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price_high_low') {
      sorted.sort((a, b) => b.price - a.price);
    }
    // `newest` is the default, assuming mock data is pre-sorted or we add a date field later
    return sorted;
  }, [filteredProducts, sortOption]);

  return (
    <div className="container mx-auto py-4 sm:py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">{pageTitle}</h1>
        <p className="text-muted-foreground">{t('shop.browse_collection')}</p>
      </div>
      <div className="flex">
        <aside className="hidden w-64 pr-8 lg:block">
            <h2 className="text-xl font-headline font-semibold mb-4">{t('shop.filters')}</h2>
            <Filters filters={filters} setFilters={setFilters} />
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
                    <SheetHeader>
                        <SheetTitle>{t('shop.filters')}</SheetTitle>
                        <SheetDescription className="sr-only">
                            Filter products by category, price, size, and color.
                        </SheetDescription>
                    </SheetHeader>
                  <ScrollArea className="h-full pr-4 mt-4">
                    <Filters filters={filters} setFilters={setFilters} />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex-1" />
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
