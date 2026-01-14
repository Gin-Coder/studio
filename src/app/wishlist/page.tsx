
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import { products } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/use-currency';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';


export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const { currency, convertPrice } = useCurrency();
  const { toast } = useToast();

  const wishlistedProducts = products.filter(product => 
    wishlistItems.some(item => item.productId === product.id)
  );

  const handleAddToCart = (product: Product) => {
    const firstVariant = product.variants[0];
    if (firstVariant) {
        addToCart(product, firstVariant, 1);
        toast({
            title: t('toast.cart.added.title'),
            description: t('toast.cart.added.description', { itemName: product.name }),
        });
    }
  };

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
      removeFromWishlist(productId);
      toast({
          title: t('toast.wishlist.removed.title'),
          description: t('toast.wishlist.removed.description', { itemName: productName }),
      });
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center py-24 text-center">
        <Heart className="h-24 w-24 text-muted-foreground" />
        <h1 className="mt-8 font-headline text-3xl font-bold">{t('wishlist.page.empty_title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('wishlist.page.empty_subtitle')}</p>
        <Button asChild className="mt-6">
          <Link href="/shop">{t('cart.continue_shopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 font-headline text-4xl font-bold">{t('wishlist.page.title')} ({wishlistedProducts.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <Link href={`/shop/${product.slug}`}>
                <div className="relative aspect-[3/4]">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </Link>
            <CardContent className="p-4">
                <h2 className="font-semibold truncate">{product.name}</h2>
                <p className="font-bold text-lg mt-1">{formatPrice(convertPrice(product.price), language, currency)}</p>
                <div className="mt-4 flex flex-col gap-2">
                    <Button className="w-full" onClick={() => handleAddToCart(product)}>
                        <ShoppingBag className="mr-2 h-4 w-4" /> {t('wishlist.add_to_cart')}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleRemoveFromWishlist(product.id, product.name)}>
                        <Trash2 className="mr-2 h-4 w-4" /> {t('wishlist.remove')}
                    </Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

    