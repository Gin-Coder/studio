'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/hooks/use-cart';
import { useToast } from "@/hooks/use-toast";
import type { Product } from '@/lib/types';

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.variants[0].colorName);
  const [selectedSize, setSelectedSize] = useState(product.variants[0].size);
  const { toast } = useToast();

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
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Color</h3>
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(product.variants.map(variant => variant.colorName))).map(color => (
              <SelectItem key={color} value={color}>{color}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Size</h3>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            {availableSizes.map(size => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button size="lg" className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
    </div>
  );
}
