
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Menu,
  ShoppingCart,
  Heart,
  Sparkles,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/hooks/use-language';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { Separator } from '../ui/separator';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { AISearch } from '../AISearch';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"


const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => {
  const { t } = useLanguage();
  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/shop', label: t('nav.shop') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const content = (
    <>
      {links.map((link) => (
          <Button variant="ghost" asChild key={link.href} className="justify-start">
            <Link href={link.href}>{link.label}</Link>
          </Button>
      ))}
    </>
  );

  if (inSheet) {
    return (
      <>
        {links.map((link) => (
          <SheetClose asChild key={link.href}>
            <Button variant="ghost" asChild className="justify-start">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          </SheetClose>
        ))}
      </>
    );
  }

  return <>{content}</>;
};

export default function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center" />
        </header>
    );
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Left Side: Mobile Menu & Desktop Logo/Nav */}
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('nav.open_menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm p-0">
               <SheetHeader className="p-4 border-b">
                 <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
                 <SheetClose asChild>
                   <Link href="/" className="flex items-center gap-2">
                     <Logo />
                     <span className="font-bold">Danny Store</span>
                   </Link>
                 </SheetClose>
               </SheetHeader>
               
               <div className="p-4">
                 <nav className="flex flex-col space-y-1">
                   <NavLinks inSheet />
                 </nav>
               </div>

               <Separator />

               <div className="p-4 space-y-4">
                 <p className="text-sm font-medium text-muted-foreground">
                   {t('nav.settings_title')}
                 </p>
                 <div className="flex items-center justify-between">
                   <p>{t('nav.language')}</p>
                   <LanguageSwitcher />
                 </div>
                 <div className="flex items-center justify-between">
                   <p>{t('nav.theme')}</p>
                   <ThemeToggle />
                 </div>
                 <div className="flex items-center justify-between">
                   <p>{t('nav.currency')}</p>
                   <CurrencySwitcher />
                 </div>
               </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex md:items-center">
            <Link href="/" className="mr-6 flex items-center gap-2">
              <Logo />
              <span className="font-headline text-lg font-bold text-primary">Danny Store</span>
            </Link>
            <nav className="flex items-center space-x-1 text-sm font-medium">
              <NavLinks />
            </nav>
          </div>
        </div>

        {/* Center: Mobile Logo */}
         <div className="flex-1 flex justify-center md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
        </div>


        {/* Right Side: Search, Actions, Settings */}
        <div className="flex flex-1 items-center justify-end space-x-1">
          <div className="hidden md:block md:w-auto md:flex-none">
            <AISearch />
          </div>
          
          {/* Mobile Search */}
          <Dialog>
            <DialogTrigger asChild>
               <Button variant="ghost" size="icon" className="md:hidden">
                  <Search />
                  <span className="sr-only">Rechercher</span>
               </Button>
            </DialogTrigger>
            <DialogContent className="p-0 top-0 translate-y-0 h-screen max-h-screen max-w-full rounded-none sm:rounded-none">
              <AISearch isDialog={true} />
            </DialogContent>
          </Dialog>


          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/virtual-try-on">
                <Sparkles />
                <span className="sr-only">{t('nav.vto_link')}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/wishlist">
                <Heart />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-4 w-4 justify-center rounded-full p-0 text-xs"
                  >
                    {wishlistCount}
                  </Badge>
                )}
                <span className="sr-only">{t('nav.wishlist_link')}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-4 w-4 justify-center rounded-full p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">{t('nav.cart_link')}</span>
              </Link>
            </Button>
            <div className="hidden md:flex">
              <LanguageSwitcher />
              <CurrencySwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
