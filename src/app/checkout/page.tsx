
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
    const { cartItems, totalPrice } = useCart();
    const { language } = useLanguage();
    const { currency } = useCurrency();

    return (
        <div className="container mx-auto py-12">
            <h1 className="mb-8 text-center font-headline text-4xl font-bold">Checkout</h1>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left side - Form */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">WhatsApp Number</Label>
                                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input id="first-name" placeholder="John" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input id="last-name" placeholder="Doe" />
                                </div>
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" placeholder="123 Main St" />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="Port-au-Prince" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">This is a UI placeholder. No real payment will be processed.</p>
                             <div className="mt-4 grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input id="card-number" placeholder="**** **** **** 1234" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2 col-span-2">
                                        <Label htmlFor="expiry">Expiration Date (MM/YY)</Label>
                                        <Input id="expiry" placeholder="MM/YY" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="123" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Button size="lg" className="w-full">Pay Now (Placeholder)</Button>
                </div>

                {/* Right side - Order Summary */}
                <div className="lg:pl-8">
                    <Card className="sticky top-24">
                        <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cartItems.map(item => (
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
                                        <p className="font-medium">{formatPrice(item.price * item.quantity, language, currency)}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Subtotal</p>
                                    <p>{formatPrice(totalPrice, language, currency)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Shipping</p>
                                    <p>Calculated at next step</p>
                                </div>
                            </div>
                             <Separator className="my-4" />
                            <div className="flex justify-between font-bold text-lg">
                                <p>Total</p>
                                <p>{formatPrice(totalPrice, language, currency)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
