
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function VirtualTryOn() {
  const { t } = useLanguage();
  return (
    <div className="mt-16 text-center rounded-lg border bg-secondary p-8">
        <Sparkles className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 mb-2 font-headline text-3xl font-bold">{t('vto.product_page.title')}</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
            {t('vto.product_page.desc')}
        </p>
        <Button disabled className="mt-6">
            {t('vto.product_page.button')}
        </Button>
    </div>
  );
}
