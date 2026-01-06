
'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Providers } from '@/components/Providers';

function LanguageUpdater({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // The suppressHydrationWarning is important here because the client will change the lang attribute
  return <html lang={language} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className="font-body antialiased">
          {children}
      </body>
    </html>
}

// This component runs only on the client and provides all the context.
export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <LanguageUpdater>
        {children}
      </LanguageUpdater>
    </Providers>
  );
}
