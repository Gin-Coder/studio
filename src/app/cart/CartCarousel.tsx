
'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useCurrency } from '@/hooks/use-currency';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/lib/types';

interface CartCarouselProps {
  items: CartItem[];
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemoveItem: (variantId: string) => void;
}

export default function CartCarousel({ items, onUpdateQuantity, onRemoveItem }: CartCarouselProps) {
  const { t, language } = useLanguage();
  const { currency, convertPrice } = useCurrency();

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: items.length > 1,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {items.map((item) => {
          const itemDisplayPrice = convertPrice(item.price * item.quantity);
          const eachDisplayPrice = convertPrice(item.price);
          return (
            <CarouselItem key={item.variantId} className="pl-4 md:basis-1/2 lg:basis-full">
              <div className="p-1">
                <Card className="overflow-hidden">
                  <CardContent className="flex flex-col md:flex-row gap-6 p-6">
                    <div className="relative aspect-[3/4] md:w-1/3 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={t(item.nameKey)}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex flex-grow flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                            <h2 className="font-headline text-2xl font-bold">{t(item.nameKey)}</h2>
                             <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.variantId)} aria-label={t('cart.remove_item')} className="-mt-2 -mr-2">
                                <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                            </Button>
                        </div>

                        <p className="text-muted-foreground">
                          {item.color} / {item.size}
                        </p>
                         <p className="mt-4 font-bold text-2xl">{formatPrice(itemDisplayPrice, language, currency)}</p>
                        {item.quantity > 1 && <p className="text-sm text-muted-foreground">{formatPrice(eachDisplayPrice, language, currency)} {t('cart.each')}</p>}
                      </div>
                      <div className="flex items-center rounded-md border w-fit mt-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                          aria-label={t('cart.decrease_quantity')}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(item.variantId, parseInt(e.target.value) || 1)}
                          className="h-8 w-12 border-0 bg-transparent text-center"
                          aria-label={t('cart.item_quantity')}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
                          aria-label={t('cart.increase_quantity')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}
