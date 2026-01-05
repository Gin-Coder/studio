
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

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();

  const wishlistedProducts = products.filter(product => 
    wishlistItems.some(item => item.productId === product.id)
  );

  const handleAddToCart = (product: typeof products[0]) => {
    const firstVariant = product.variants[0];
    if (firstVariant) {
        addToCart(product, firstVariant, 1);
        toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
        });
    }
  };

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
      removeFromWishlist(productId);
      toast({
          variant: "destructive",
          title: "Removed from wishlist",
          description: `${productName} has been removed from your wishlist.`,
      });
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center py-24 text-center">
        <Heart className="h-24 w-24 text-muted-foreground" />
        <h1 className="mt-8 font-headline text-3xl font-bold">Votre liste de souhaits est vide</h1>
        <p className="mt-2 text-muted-foreground">Parcourez nos collections pour trouver des articles qui vous plaisent.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">{t('cart.continue_shopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 font-headline text-4xl font-bold">Ma Liste de Souhaits ({wishlistedProducts.length})</h1>
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
                <p className="font-bold text-lg mt-1">${product.price.toFixed(2)}</p>
                <div className="mt-4 flex flex-col gap-2">
                    <Button className="w-full" onClick={() => handleAddToCart(product)}>
                        <ShoppingBag className="mr-2 h-4 w-4" /> Ajouter au panier
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleRemoveFromWishlist(product.id, product.name)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Retirer
                    </Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
