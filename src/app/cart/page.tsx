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
import {
  generateWhatsAppCheckoutMessage
} from '@/ai/flows/generate-whatsapp-checkout-message';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount, totalPrice } = useCart();
  const { t, language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleWhatsappCheckout = async () => {
    setIsGenerating(true);
    try {
        const mockUser = { name: 'John Doe', whatsapp: '+15551234567' }; // Placeholder user
        const orderId = `DS-${Date.now()}`;

        if(!mockUser.whatsapp) {
            toast({
                variant: 'destructive',
                title: 'WhatsApp Number Required',
                description: 'Please add your WhatsApp number to your profile to proceed.',
            });
            return;
        }

        const whatsappMessageInput = {
            language: language === 'fr' ? 'FR' : language === 'ht' ? 'Kreyòl' : 'EN',
            products: cartItems.map(item => ({
                name: item.name,
                color: item.color,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                imageUrl: item.image,
            })),
            subtotal: totalPrice,
            total: totalPrice, // Delivery fee handled via WhatsApp
            orderId: orderId,
            customerName: mockUser.name,
            customerWhatsApp: mockUser.whatsapp,
        };

        const result = await generateWhatsAppCheckoutMessage(whatsappMessageInput);
        const encodedMessage = encodeURIComponent(result.message);
        window.open(`https://wa.me/${mockUser.whatsapp.replace(/\+/g, '')}?text=${encodedMessage}`, '_blank');

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


  if (cartCount === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center py-24 text-center">
        <ShoppingCart className="h-24 w-24 text-muted-foreground" />
        <h1 className="mt-8 font-headline text-3xl font-bold">{t('cart.empty')}</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">{t('cart.continue_shopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 font-headline text-4xl font-bold">{t('cart.title')} ({cartCount})</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => (
            <Card key={item.variantId}>
              <CardContent className="flex items-center gap-4 p-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={133}
                  className="rounded-md object-cover"
                />
                <div className="flex-grow">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {item.color} / {item.size}
                  </p>
                  <p className="mt-2 font-bold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center rounded-md border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.variantId, parseInt(e.target.value) || 1)}
                    className="h-8 w-12 border-0 bg-transparent text-center"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="w-20 text-right font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.variantId)}>
                  <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.delivery')}</span>
                <span className="text-sm">{t('cart.delivery_info')}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>{t('cart.total')}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
               <Button size="lg" className="w-full mt-4" onClick={handleWhatsappCheckout} disabled={isGenerating}>
                 {isGenerating ? "Generating..." : t('cart.checkout_whatsapp')}
               </Button>
               <Button variant="outline" size="lg" className="w-full" asChild>
                 <Link href="/checkout">{t('cart.checkout_other')}</Link>
               </Button>
            </CardContent>
          </Card>
           <Card className="mt-4">
            <CardContent className="p-6 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-2 font-headline font-semibold">Try on your full outfit!</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-4">See how your selected items look together before you buy.</p>
              <Button asChild>
                <Link href="/virtual-try-on">Virtual Try-On</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
