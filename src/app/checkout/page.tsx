
'use client';

import { useState } from "react";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart, ArrowLeft, CreditCard, Smartphone } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const STEPS = [
  { id: 1, nameKey: 'checkout.contact_info' },
  { id: 2, nameKey: 'checkout.shipping_address' },
  { id: 3, nameKey: 'checkout.payment' },
];

const CheckoutSummary = () => {
    const { cartItems, cartCount } = useCart();
    const { t, language } = useLanguage();
    const { currency, convertPrice } = useCurrency();

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const displayTotalPrice = convertPrice(totalPrice);

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="order-summary">
                <AccordionTrigger>
                    <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-2">
                             <ShoppingCart className="h-5 w-5 text-primary" />
                             <span className="font-semibold">{t('checkout.order_summary')} ({cartCount})</span>
                        </div>
                        <span className="font-bold text-lg">{formatPrice(displayTotalPrice, language, currency)}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4 pt-4">
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
                            <p className="text-sm">{t('cart.delivery_info')}</p>
                        </div>
                    </div>
                     <Separator className="my-4" />
                    <div className="flex justify-between font-bold text-lg">
                        <p>{t('checkout.total')}</p>
                        <p>{formatPrice(displayTotalPrice, language, currency)}</p>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

const StepIndicator = ({ currentStep, onStepClick }: { currentStep: number, onStepClick: (step: number) => void }) => {
    const { t } = useLanguage();
    return (
        <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-8">
            {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    <button
                        onClick={() => onStepClick(step.id)}
                        disabled={step.id > currentStep}
                        className="flex items-center gap-2"
                    >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {step.id}
                        </div>
                        <span className={`hidden md:inline ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>{t(step.nameKey)}</span>
                    </button>
                    {index < STEPS.length - 1 && <Separator orientation="horizontal" className="w-8 md:w-16 ml-2 md:ml-4" />}
                </div>
            ))}
        </div>
    );
};


export default function CheckoutPage() {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    
    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const goToStep = (step: number) => {
        if (step < currentStep) {
            setCurrentStep(step);
        }
    }


    return (
        <div className="container mx-auto max-w-2xl py-8 md:py-12">
            <h1 className="mb-8 text-center font-headline text-3xl md:text-4xl font-bold">{t('checkout.title')}</h1>
            
            <div className="mb-8">
              <CheckoutSummary />
            </div>

            <StepIndicator currentStep={currentStep} onStepClick={goToStep} />

            <div className="mt-8">
                {currentStep === 1 && (
                    <Card>
                        <CardHeader><CardTitle>{t('checkout.contact_info')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('checkout.email')}</Label>
                                <Input id="email" type="email" placeholder="m@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">{t('checkout.whatsapp')}</Label>
                                <Input id="phone" type="tel" placeholder="+509 XX XX XX XX" />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {currentStep === 2 && (
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
                )}

                {currentStep === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('checkout.payment')}</CardTitle>
                            <p className="text-sm text-muted-foreground">{t('checkout.payment_coming_soon')}</p>
                        </CardHeader>
                        <CardContent className="space-y-6 opacity-50 pointer-events-none">
                           <RadioGroup defaultValue="card" disabled>
                               <div className="rounded-md border p-4">
                                   <div className="flex items-center justify-between">
                                       <Label htmlFor="card" className="flex items-center gap-2 font-semibold">
                                            <CreditCard /> {t('checkout.payment_card')}
                                       </Label>
                                       <RadioGroupItem value="card" id="card" />
                                   </div>
                               </div>
                               <div className="rounded-md border p-4">
                                   <div className="flex items-center justify-between">
                                       <Label htmlFor="moncash" className="flex items-center gap-2 font-semibold">
                                            <Smartphone /> {t('checkout.payment_moncash')}
                                       </Label>
                                       <RadioGroupItem value="moncash" id="moncash" />
                                   </div>
                               </div>
                               <div className="rounded-md border p-4">
                                   <div className="flex items-center justify-between">
                                       <Label htmlFor="natcash" className="flex items-center gap-2 font-semibold">
                                            <Smartphone /> {t('checkout.payment_natcash')}
                                       </Label>
                                       <RadioGroupItem value="natcash" id="natcash" />
                                   </div>
                               </div>
                           </RadioGroup>
                           <Button size="lg" className="w-full" disabled>{t('checkout.pay_button')}</Button>
                        </CardContent>
                    </Card>
                )}
            </div>

             <div className="mt-8 flex items-center justify-between">
                <div>
                   {currentStep > 1 && (
                        <Button variant="ghost" onClick={prevStep}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('checkout.back')}
                        </Button>
                    )}
                </div>
                <div>
                    {currentStep < STEPS.length ? (
                        <Button size="lg" onClick={nextStep}>{t('checkout.continue')}</Button>
                    ) : (
                        <Button size="lg" disabled>{t('checkout.pay_button')}</Button>
                    )}
                </div>
            </div>
        </div>
    );
}

    

    