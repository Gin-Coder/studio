
'use client';

import { type ReactNode, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/hooks/use-language';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { CurrencyProvider } from '@/hooks/use-currency';
import { FirebaseClientProvider } from '@/firebase/client-provider';

// This component updates the `lang` attribute on the `<html>` tag.
// It must be a child of LanguageProvider.
function LanguageAttributeUpdater() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}

// This is the top-level client component that wraps the entire app with all necessary context providers.
export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <LanguageAttributeUpdater />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CurrencyProvider>
          <FirebaseClientProvider>
            <WishlistProvider>
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </CartProvider>
            </WishlistProvider>
          </FirebaseClientProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
