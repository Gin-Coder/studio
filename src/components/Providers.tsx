'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/hooks/use-language';
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
