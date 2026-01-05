'use client';

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/hooks/use-language';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { Separator } from '../ui/separator';

const NavLinks = () => {
  const { t } = useLanguage();
  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/shop', label: t('nav.shop') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <>
      {links.map((link) => (
        <Button key={link.href} variant="ghost" asChild>
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </>
  );
};

export default function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavLinks />
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
           <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm">
                  <div className="p-4">
                    <Link href="/" className="mb-4">
                      <Logo />
                    </Link>
                  </div>
                  <Separator />
                  <div className="flex flex-col space-y-2 p-4">
                    <NavLinks />
                  </div>
                  <Separator />
                   <div className="p-4 space-y-4">
                     <p className="text-sm font-medium text-muted-foreground">Settings</p>
                    <div className="flex items-center justify-between">
                       <p>Language</p>
                       <LanguageSwitcher />
                    </div>
                     <div className="flex items-center justify-between">
                       <p>Theme</p>
                       <ThemeToggle />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
          </div>

          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex md:items-center md:gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                <User />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
             <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/wishlist">
                <Heart />
                {wishlistCount > 0 && <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0">{wishlistCount}</Badge>}
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart />
                {cartCount > 0 && <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0">{cartCount}</Badge>}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
