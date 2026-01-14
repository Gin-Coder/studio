
'use client';

import { useEffect, type ReactNode, useState } from 'react';
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

// This component contains the main layout of the application.
// It uses hooks that require various providers, so it must be a child of those providers.
function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LanguageAttributeUpdater />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}

// This component wraps the main layout with all necessary context providers.
function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CurrencyProvider>
        <FirebaseClientProvider>
          <WishlistProvider>
            <CartProvider>
              <MainLayout>{children}</MainLayout>
            </CartProvider>
          </WishlistProvider>
        </FirebaseClientProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}


// This is the top-level client component that ensures providers are only rendered on the client.
export function ClientLayout({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // On the server and during the initial client render, we render a simplified layout
  // to avoid hydration mismatches. The full provider-wrapped layout is rendered only on the client
  // after the component has mounted.
  if (!isMounted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    );
  }

  // The top-level LanguageProvider wraps everything.
  // AppProviders then wraps the children with all other necessary contexts.
  return (
    <LanguageProvider>
      <AppProviders>{children}</AppProviders>
    </LanguageProvider>
  );
}
