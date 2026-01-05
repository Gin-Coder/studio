'use client';

import Link from 'next/link';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Search, ShoppingCart, Heart, User, Sparkles } from 'lucide-react';
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
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="p-4">
                  <Link href="/">
                      <Logo />
                  </Link>
                </div>
                <Separator />
                <div className="flex flex-col space-y-2 p-4">
                  <NavLinks />
                </div>
                <Separator />
                <div className="p-4 space-y-4">
                  <p className="text-sm font-medium text-muted-foreground">Paramètres</p>
                  <div className="flex items-center justify-between">
                    <p>Langue</p>
                    <LanguageSwitcher />
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Thème</p>
                    <ThemeToggle />
                  </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="ml-4 hidden md:flex">
          <Link href="/" className="mr-6">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-1 text-sm font-medium">
            <NavLinks />
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <div className="hidden sm:block w-full flex-1 md:w-auto md:flex-none">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher des produits..."
                  className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center">
             <Button variant="ghost" size="icon" asChild>
                <Link href="#">
                    <Sparkles />
                    <span className="sr-only">Virtual Try-On</span>
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                <User />
                <span className="sr-only">Compte</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/wishlist">
                <Heart />
                {wishlistCount > 0 && <Badge variant="destructive" className="absolute -right-1 -top-1 h-4 w-4 justify-center rounded-full p-0 text-xs">{wishlistCount}</Badge>}
                <span className="sr-only">Liste de souhaits</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart />
                {cartCount > 0 && <Badge variant="destructive" className="absolute -right-1 -top-1 h-4 w-4 justify-center rounded-full p-0 text-xs">{cartCount}</Badge>}
                <span className="sr-only">Panier</span>
              </Link>
            </Button>
             <div className="hidden md:flex">
               <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
