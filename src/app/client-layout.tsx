'use client';

import { useEffect, type ReactNode } from 'react';
import { useLanguage, LanguageProvider } from '@/hooks/use-language';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

function LanguageAttributeUpdater() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}

// This component runs only on the client and provides all the context.
export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          {/* The component below will update the lang attribute, and it needs to be a child of LanguageProvider */}
          <LanguageAttributeUpdater />
          <CartProvider>
            <WishlistProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </FirebaseClientProvider>
  );
}

    