import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageSquare, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl py-16">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-6xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          We're here to help. Reach out to us anytime.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="h-12 w-12 text-primary"/>
            <h2 className="mt-4 font-headline text-2xl font-semibold">WhatsApp Support</h2>
            <p className="mt-2 text-muted-foreground">
                For the fastest response, please contact us via WhatsApp for order inquiries, support, and more.
            </p>
            <Button className="mt-4 w-full" asChild>
                <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4"/> Chat on WhatsApp
                </a>
            </Button>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center p-8">
            <Mail className="h-12 w-12 text-primary"/>
            <h2 className="mt-4 font-headline text-2xl font-semibold">Email Support</h2>
            <p className="mt-2 text-muted-foreground">
                You can also reach us by email. We'll get back to you within 24 hours.
            </p>
             <Button className="mt-4 w-full" variant="outline" asChild>
                <a href="mailto:support@dannystore.com">
                    support@dannystore.com
                </a>
            </Button>
        </Card>
      </div>

      <div className="mt-16">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does WhatsApp checkout work?</AccordionTrigger>
            <AccordionContent>
              After you click "Finalize via WhatsApp", a pre-filled message with your order details will be generated. Simply send this message to our WhatsApp number, and our team will contact you to confirm your delivery address and finalize the order.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What are the shipping costs?</AccordionTrigger>
            <AccordionContent>
              Shipping costs vary based on your location. All delivery fees will be confirmed and agreed upon with you via WhatsApp before your order is finalized.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How does the Virtual Try-On work?</AccordionTrigger>
            <AccordionContent>
              Our Virtual Try-On feature uses AI to place the selected clothing onto a model or a photo you upload. This gives you a better idea of how the item might look. You have 5 free tries per day.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
