
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function VirtualTryOn() {
  return (
    <div className="mt-16 text-center rounded-lg border bg-secondary p-8">
        <Sparkles className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 mb-2 font-headline text-3xl font-bold">Essayage Virtuel</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
            Bientôt disponible! Cette fonctionnalité vous permettra de voir à quoi ressemble cet article sur vous avant de l'acheter.
        </p>
        <Button disabled className="mt-6">
            Prochainement
        </Button>
    </div>
  );
}
