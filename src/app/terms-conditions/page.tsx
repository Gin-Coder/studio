
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';

export default function TermsConditionsPage() {
  const [lastUpdated, setLastUpdated] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    // This will only run on the client, after hydration, to avoid mismatch
    setLastUpdated(new Date().toLocaleDateString());
  }, []);
  
  return (
    <div className="container mx-auto max-w-3xl py-16">
      <div className="prose dark:prose-invert">
        <h1 className="font-headline text-4xl font-bold text-primary">{t('terms.title')}</h1>
        <p className="text-muted-foreground">{t('terms.last_updated', { date: lastUpdated || '...' })}</p>
        
        <p>
          {t('terms.p1')}
        </p>

        <h2 className="font-headline">{t('terms.h1')}</h2>
        <p>
          {t('terms.p2')}
        </p>

        <h2 className="font-headline">{t('terms.h2')}</h2>
        <p>
          {t('terms.p3')}
        </p>

        <h2 className="font-headline">{t('terms.h3')}</h2>
        <p>
          {t('terms.p4')}
        </p>
        
        <h2 className="font-headline">{t('terms.h4')}</h2>
        <p>
          {t('terms.p5')}
        </p>

        <h2 className="font-headline">{t('terms.h5')}</h2>
        <p>
          {t('terms.p6')}
        </p>
        
        <h2 className="font-headline">{t('terms.h6')}</h2>
        <p>
          {t('terms.p7')}
        </p>
      </div>
    </div>
  );
}
