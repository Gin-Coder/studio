
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageSquare, Mail } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function ContactPage() {
    const { t } = useLanguage();
  return (
    <div className="container mx-auto max-w-4xl py-16">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-6xl">
          {t('contact.title')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="h-12 w-12 text-primary"/>
            <h2 className="mt-4 font-headline text-2xl font-semibold">{t('contact.whatsapp.title')}</h2>
            <p className="mt-2 text-muted-foreground">
                {t('contact.whatsapp.description')}
            </p>
            <Button className="mt-4 w-full" asChild>
                <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4"/> {t('contact.whatsapp.button')}
                </a>
            </Button>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center p-8">
            <Mail className="h-12 w-12 text-primary"/>
            <h2 className="mt-4 font-headline text-2xl font-semibold">{t('contact.email.title')}</h2>
            <p className="mt-2 text-muted-foreground">
                {t('contact.email.description')}
            </p>
             <Button className="mt-4 w-full" variant="outline" asChild>
                <a href="mailto:support@dannystore.com">
                    support@dannystore.com
                </a>
            </Button>
        </Card>
      </div>

      <div className="mt-16">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold">{t('contact.faq.title')}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t('contact.faq.q1')}</AccordionTrigger>
            <AccordionContent>
              {t('contact.faq.a1')}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t('contact.faq.q2')}</AccordionTrigger>
            <AccordionContent>
              {t('contact.faq.a2')}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{t('contact.faq.q3')}</AccordionTrigger>
            <AccordionContent>
              {t('contact.faq.a3')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
