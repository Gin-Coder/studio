
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useToast } from '@/hooks/use-toast';
import { cn, formatPrice } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const firstVariant = product.variants[0];
    if (firstVariant) {
      addToCart(product, firstVariant, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };
  
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <Card className="group w-full overflow-hidden flex flex-col">
      <Link href={`/shop/${product.slug}`} className="flex-grow">
        <CardContent className="relative aspect-[3/4] p-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={product.imageHints[0]}
          />
          <Badge variant="secondary" className="absolute top-2 left-2">{product.category}</Badge>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-background/60 hover:bg-background/80 rounded-full"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-5 w-5", isWishlisted ? 'fill-destructive text-destructive' : 'text-foreground')} />
          </Button>
        </CardContent>
      </Link>
      <div className="p-2 md:p-4 flex-shrink-0">
        <h3 className="truncate font-headline text-base md:text-lg font-semibold">{product.name}</h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2">
            <p className="font-semibold text-sm md:text-base">{formatPrice(product.price, language)}</p>
            <Button
              size="sm"
              className="w-full md:flex-1 md:max-w-[140px]"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> 
              <span>{language === 'en' ? 'Add to cart' : language === 'fr' ? 'Ajouter' : 'Ajoute'}</span>
            </Button>
        </div>
      </div>
    </Card>
  );
}
