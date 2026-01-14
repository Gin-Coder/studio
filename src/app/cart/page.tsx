
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingCart, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/hooks/use-currency';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();
  const { t, language } = useLanguage();
  const { currency, convertPrice } = useCurrency();
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const displayTotalPrice = convertPrice(totalPrice);

  const handleWhatsappCheckout = async () => {
    setIsGenerating(true);
    try {
        const storeOwnerWhatsApp = '50933377934';
        const orderId = `DS-${Date.now()}`;
        const customerName = 'Valued Customer';

        let message = `*New Order from Danny Store*\n\n`;
        message += `*Order ID:* ${orderId}\n`;
        message += `*Customer:* ${customerName}\n\n`;
        message += `*Items:*\n`;
        
        cartItems.forEach(item => {
            const itemDisplayPrice = convertPrice(item.price * item.quantity);
            message += `- ${item.name} (${item.color}, ${item.size}) x ${item.quantity} - ${formatPrice(itemDisplayPrice, language, currency)}\n`;
        });

        message += `\n*Subtotal:* ${formatPrice(displayTotalPrice, language, currency)}\n`;
        message += `*Total:* ${formatPrice(displayTotalPrice, language, currency)} (Delivery to be confirmed)\n\n`;
        message += `Hello, I would like to confirm this order.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${storeOwnerWhatsApp}?text=${encodedMessage}`, '_blank');

    } catch (error) {
        console.error('Failed to generate WhatsApp message', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not generate WhatsApp message. Please try again.',
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleOtherCheckout = () => {
    router.push('/checkout');
  }


  if (cartCount === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center py-24 text-center">
        <ShoppingCart className="h-24 w-24 text-muted-foreground" />
        <h1 className="mt-8 font-headline text-3xl font-bold">{t('cart.empty')}</h1>
        <p className="mt-2 text-muted-foreground">{t('cart.empty_subtitle')}</p>
        <Button asChild className="mt-6">
          <Link href="/shop">{t('cart.continue_shopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 sm:py-12">
      <h1 className="mb-8 font-headline text-3xl sm:text-4xl font-bold">{t('cart.title')} {t('cart.item_count', { count: cartCount })}</h1>
      <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
           <Card>
              <CardContent className="p-0 sm:p-6">
                  <div className="space-y-6 sm:space-y-0">
                    {cartItems.map((item, index) => {
                        const itemDisplayPrice = convertPrice(item.price * item.quantity);
                        const eachDisplayPrice = convertPrice(item.price);
                      
                        return (
                          <div key={item.variantId} className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-0 sm:mb-6">
                              <div className="relative w-full sm:w-24 aspect-[3/4] sm:aspect-square flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="rounded-md object-cover"
                                />
                              </div>
                              <div className="flex-grow w-full">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h2 className="font-semibold text-base sm:text-lg">{item.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                      {item.color} / {item.size}
                                    </p>
                                  </div>
                                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.variantId)} aria-label={t('cart.remove_item')} className="sm:hidden -mt-2 -mr-2">
                                      <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                                  </Button>
                                </div>
                                <div className="flex items-end justify-between mt-4">
                                  <div className="flex items-center rounded-md border w-fit">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                                      aria-label={t('cart.decrease_quantity')}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) => updateQuantity(item.variantId, parseInt(e.target.value) || 1)}
                                      className="h-8 w-12 border-0 bg-transparent text-center"
                                      aria-label={t('cart.item_quantity')}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                      aria-label={t('cart.increase_quantity')}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-base sm:text-lg">{formatPrice(itemDisplayPrice, language, currency)}</p>
                                    {item.quantity > 1 && <p className="text-xs text-muted-foreground">{formatPrice(eachDisplayPrice, language, currency)} {t('cart.each')}</p>}
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.variantId)} aria-label={t('cart.remove_item')} className="hidden sm:flex">
                                <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                              </Button>
                            {index < cartItems.length - 1 && <Separator className="mt-6 sm:hidden" />}
                          </div>
                        )
                    })}
                  </div>
              </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('cart.order_summary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                <span>{formatPrice(displayTotalPrice, language, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.delivery')}</span>
                <span className="text-sm">{t('cart.delivery_info')}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(displayTotalPrice, language, currency)}</span>
              </div>
               <Button size="lg" className="w-full mt-4" onClick={handleWhatsappCheckout} disabled={isGenerating}>
                 {isGenerating ? t('cart.generating_message') : t('cart.checkout_whatsapp')}
               </Button>
               <Button variant="outline" size="lg" className="w-full" onClick={handleOtherCheckout}>
                 {t('cart.checkout_other')}
               </Button>
            </CardContent>
          </Card>
           <Card className="mt-4">
            <CardContent className="p-6 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-2 font-headline font-semibold">{t('cart.vto_prompt.title')}</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-4">{t('cart.vto_prompt.desc')}</p>
              <Button asChild>
                <Link href="/virtual-try-on">{t('cart.vto_prompt.button')}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    