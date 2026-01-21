
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';

export default function PrivacyPolicyPage() {
  const [lastUpdated, setLastUpdated] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    // This will only run on the client, after hydration, to avoid mismatch
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="container mx-auto max-w-3xl py-16">
      <div className="prose dark:prose-invert">
        <h1 className="font-headline text-4xl font-bold text-primary">{t('privacy_policy.title')}</h1>
        <p className="text-muted-foreground">{t('privacy_policy.last_updated', { date: lastUpdated || '...' })}</p>
        
        <p>
          {t('privacy_policy.p1')}
        </p>

        <h2 className="font-headline">{t('privacy_policy.h2')}</h2>
        <ul>
          <li>{t('privacy_policy.l1')}</li>
          <li>{t('privacy_policy.l2')}</li>
          <li>{t('privacy_policy.l3')}</li>
          <li>{t('privacy_policy.l4')}</li>
          <li>{t('privacy_policy.l5')}</li>
        </ul>

        <h2 className="font-headline">{t('privacy_policy.h3')}</h2>
        <p>
          {t('privacy_policy.p2')}
        </p>

        <h2 className="font-headline">{t('privacy_policy.h4')}</h2>
        <p>
          {t('privacy_policy.p3')}
        </p>
        
        <h2 className="font-headline">{t('privacy_policy.h5')}</h2>
        <p>
          {t('privacy_policy.p4')}
        </p>

        <h2 className="font-headline">{t('privacy_policy.h6')}</h2>
        <p>
          {t('privacy_policy.p5')}
        </p>
      </div>
    </div>
  );
}
