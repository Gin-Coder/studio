
'use client';

import { useEffect } from 'react';
import { useLanguage, LanguageProvider } from '@/hooks/use-language';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';


function LanguageAttributeUpdater() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}

// This component runs only on the client and provides all the context.
export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        {/* The component below will update the lang attribute, and it needs to be a child of LanguageProvider */}
        <LanguageAttributeUpdater />
        <CartProvider>
          <WishlistProvider>
            {/* The suppressHydrationWarning is important here because the client will change the lang attribute */}
            <html lang="en" suppressHydrationWarning>
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
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </body>
            </html>
          </WishlistProvider>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
