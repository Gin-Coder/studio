
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
  Search,
  ShoppingCart,
  Heart,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
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
        </div>

        <div className="hidden md:flex md:items-center">
          <Link href="/" className="mr-6 flex items-center gap-2">
            <Logo />
            <span className="font-headline text-lg font-bold text-primary">Danny Store</span>
          </Link>
          <nav className="flex items-center space-x-1 text-sm font-medium">
             {/* Main nav links for desktop */}
            <NavLinks />
          </nav>
        </div>
        
        <div className="flex-1 flex justify-center items-center md:hidden">
            <Link href="/#" className="flex items-center justify-center">
                <span style={theme === 'light' ? { textShadow: '0 0 5px rgba(0,0,0,0.5)' } : {}} className={cn(
                    "font-headline text-xl font-bold text-accent transition-opacity duration-300 md:hidden",
                    isScrolled ? "opacity-100" : "opacity-0"
                )}>
                    Danny Store
                </span>
            </Link>
        </div>

        <div className="flex items-center justify-end space-x-0 md:space-x-2">
          <div className="hidden sm:block w-full flex-1 md:w-auto md:flex-none">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('nav.search_placeholder')}
                  className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
                />
              </div>
            </form>
          </div>
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
