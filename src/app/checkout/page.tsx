
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { useCurrency } from "@/hooks/use-currency";

export default function CheckoutPage() {
    const { cartItems } = useCart();
    const { t, language } = useLanguage();
    const { currency, convertPrice } = useCurrency();

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const displayTotalPrice = convertPrice(totalPrice);

    return (
        <div className="container mx-auto py-12">
            <h1 className="mb-8 text-center font-headline text-4xl font-bold">{t('checkout.title')}</h1>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left side - Form */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader><CardTitle>{t('checkout.contact_info')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('checkout.email')}</Label>
                                <Input id="email" type="email" placeholder="m@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">{t('checkout.whatsapp')}</Label>
                                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>{t('checkout.shipping_address')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">{t('checkout.first_name')}</Label>
                                    <Input id="first-name" placeholder="John" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">{t('checkout.last_name')}</Label>
                                    <Input id="last-name" placeholder="Doe" />
                                </div>
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="address">{t('checkout.address')}</Label>
                                <Input id="address" placeholder="123 Main St" />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="city">{t('checkout.city')}</Label>
                                <Input id="city" placeholder="Port-au-Prince" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader><CardTitle>{t('checkout.payment')}</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t('checkout.payment_placeholder')}</p>
                             <div className="mt-4 grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="card-number">{t('checkout.card_number')}</Label>
                                    <Input id="card-number" placeholder="**** **** **** 1234" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2 col-span-2">
                                        <Label htmlFor="expiry">{t('checkout.expiry')}</Label>
                                        <Input id="expiry" placeholder="MM/YY" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="cvc">{t('checkout.cvc')}</Label>
                                        <Input id="cvc" placeholder="123" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Button size="lg" className="w-full">{t('checkout.pay_button')}</Button>
                </div>

                {/* Right side - Order Summary */}
                <div className="lg:pl-8">
                    <Card className="sticky top-24">
                        <CardHeader><CardTitle>{t('checkout.order_summary')}</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cartItems.map(item => {
                                    const itemDisplayPrice = convertPrice(item.price * item.quantity);
                                    return (
                                        <div key={item.variantId} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-16 w-16 rounded-md border">
                                                    <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="rounded-md" />
                                                    <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{item.quantity}</div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">{item.color} / {item.size}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium">{formatPrice(itemDisplayPrice, language, currency)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">{t('cart.subtotal')}</p>
                                    <p>{formatPrice(displayTotalPrice, language, currency)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">{t('checkout.shipping')}</p>
                                    <p>{t('checkout.shipping_info')}</p>
                                </div>
                            </div>
                             <Separator className="my-4" />
                            <div className="flex justify-between font-bold text-lg">
                                <p>{t('checkout.total')}</p>
                                <p>{formatPrice(displayTotalPrice, language, currency)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

    