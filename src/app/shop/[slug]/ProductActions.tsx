
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/hooks/use-cart';
import { useToast } from "@/hooks/use-toast";
import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { ToastAction } from '@/components/ui/toast';

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.colorName || '');
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size || '');
  const { toast } = useToast();
  const { t } = useLanguage();

  const availableSizes = product.variants
    .filter(variant => variant.colorName === selectedColor)
    .map(variant => variant.size);

  const selectedVariant = product.variants.find(
    variant => variant.colorName === selectedColor && variant.size === selectedSize
  );

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, 1);
       toast({
          title: t('toast.cart.added.title'),
          description: t('toast.cart.added.description', { itemName: product.name }),
          action: (
            <ToastAction altText={t('cart.title')} asChild>
                <Link href="/cart">{t('toast.cart.view_cart')}</Link>
            </ToastAction>
          )
        });
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{t('filter.color')}</h3>
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('product.select_color')} />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(product.variants.map(variant => variant.colorName))).map(color => (
              <SelectItem key={color} value={color}>{color}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="text-lg font-semibold">{t('filter.size')}</h3>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('product.select_size')} />
          </SelectTrigger>
          <SelectContent>
            {availableSizes.map(size => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={!selectedVariant}>{t('product.add_to_cart')}</Button>
    </div>
  );
}
