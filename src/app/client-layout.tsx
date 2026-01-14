
'use client';

import { useEffect, type ReactNode, useState } from 'react';
import { useLanguage, LanguageProvider } from '@/hooks/use-language';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { CurrencyProvider } from '@/hooks/use-currency';
import { FirebaseClientProvider } from '@/firebase/client-provider';

function LanguageAttributeUpdater() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}

function Providers({ children }: { children: ReactNode }) {
    return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CurrencyProvider>
        <FirebaseClientProvider>
          <CartProvider>
            <WishlistProvider>
              {/* This component needs to be a child of LanguageProvider to work */}
              <LanguageAttributeUpdater />
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </FirebaseClientProvider>
      </CurrencyProvider>
    </ThemeProvider>
    )
}

// This component runs only on the client and provides all the context.
export function ClientLayout({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Until the component is mounted, we can't be sure we're on the client,
  // so we'll render a simplified version. This avoids hydration mismatches
  // with things like theme, language, etc.
  if (!isMounted) {
    return (
      <>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </>
    );
  }

  return (
    <LanguageProvider>
        <Providers>
            {children}
        </Providers>
    </LanguageProvider>
  );
}
