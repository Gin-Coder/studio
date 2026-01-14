
'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/hooks/use-currency';
import CartCarousel from './CartCarousel';

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
        
        let message = `*${t('whatsapp.order.title')}*\n\n`;
        message += `*${t('whatsapp.order.id')}:* ${orderId}\n`;
        message += `*${t('whatsapp.order.customer')}:* ${t('whatsapp.order.valued_customer')}\n\n`;
        message += `*${t('whatsapp.order.items')}:*\n`;
        
        cartItems.forEach(item => {
            const itemDisplayPrice = convertPrice(item.price * item.quantity);
            message += `- ${item.name} (${item.color}, ${item.size}) x ${item.quantity} - ${formatPrice(itemDisplayPrice, language, currency)}\n`;
        });

        message += `\n*${t('cart.subtotal')}:* ${formatPrice(displayTotalPrice, language, currency)}\n`;
        message += `*${t('cart.total')}:* ${formatPrice(displayTotalPrice, language, currency)} (${t('whatsapp.order.delivery_note')})\n\n`;
        message += `${t('whatsapp.order.confirmation_prompt')}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${storeOwnerWhatsApp}?text=${encodedMessage}`, '_blank');

    } catch (error) {
        console.error('Failed to generate WhatsApp message', error);
        toast({
            variant: 'destructive',
            title: t('toast.error.title'),
            description: t('toast.error.whatsapp_failed'),
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
            <CartCarousel items={cartItems} onUpdateQuantity={updateQuantity} onRemoveItem={removeFromCart} />
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
              <h3 className="mt-2 font-headline font-semibold">{t('vto.product_page.title')}</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-4">{t('vto.product_page.desc')}</p>
              <Button variant="outline" asChild>
                  <Link href="/virtual-try-on">{t('cart.vto_prompt.button')}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
