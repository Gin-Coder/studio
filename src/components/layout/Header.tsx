
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
  User,
  Sparkles,
  LogIn,
  LogOut,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/hooks/use-language';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { Separator } from '../ui/separator';
import { useFirebase } from '@/firebase';
import { useState, useEffect } from 'react';

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
        <SheetClose asChild key={link.href}>
            <Button variant="ghost" asChild className="justify-start">
              <Link href={link.href}>{link.label}</Link>
            </Button>
        </SheetClose>
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
  const { user, isUserLoading, auth } = useFirebase();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


   const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/login');
    }
  };

  // Render a placeholder or null on the server and initial client render
  if (!mounted) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95">
            <div className="container flex h-16 items-center" />
        </header>
    );
  }

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

                {!isUserLoading && !user && (
                    <div className="p-4 pt-0">
                      <SheetClose asChild>
                        <Button asChild className="w-full">
                            <Link href="/login">
                                <LogIn className="mr-2 h-4 w-4" />
                                Se connecter
                            </Link>
                        </Button>
                      </SheetClose>
                    </div>
                )}
                
                {user && (
                   <div className="p-4 pt-0">
                     <SheetClose asChild>
                       <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleSignOut}>
                           <LogOut className="mr-2 h-4 w-4" />
                           Se déconnecter
                       </Button>
                     </SheetClose>
                   </div>
                )}

               <Separator />

               <div className="p-4 space-y-4">
                 <p className="text-sm font-medium text-muted-foreground">
                   Paramètres
                 </p>
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
             {/* Main nav links for desktop */}
            <Button variant="ghost" asChild><Link href="/">Accueil</Link></Button>
            <Button variant="ghost" asChild><Link href="/shop">Boutique</Link></Button>
            <Button variant="ghost" asChild><Link href="/about">À Propos</Link></Button>
            <Button variant="ghost" asChild><Link href="/contact">Contact</Link></Button>
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
              <Link href="/virtual-try-on">
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
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-4 w-4 justify-center rounded-full p-0 text-xs"
                  >
                    {wishlistCount}
                  </Badge>
                )}
                <span className="sr-only">Liste de souhaits</span>
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
                <span className="sr-only">Panier</span>
              </Link>
            </Button>
            <div className="hidden md:flex">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
