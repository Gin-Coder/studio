
'use client';

import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VirtualTryOnPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-24 text-center">
      <Sparkles className="h-24 w-24 text-primary" />
      <h1 className="mt-8 font-headline text-4xl font-bold">
        {t('vto.title')}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        {t('vto.coming_soon_desc')}
      </p>
       <Button asChild className="mt-8">
          <Link href="/shop">{t('cart.continue_shopping')}</Link>
        </Button>
    </div>
  );
}
