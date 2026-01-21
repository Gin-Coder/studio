'use client';

import Link from 'next/link';
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
  User as UserIcon,
  LogOut,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

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

const UserNav = () => {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const { t } = useLanguage();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({
                title: t('logout.success_title'),
                description: t('logout.success_desc'),
            });
            router.push('/');
        } catch (error) {
            console.error("Logout Error: ", error);
            toast({
                variant: "destructive",
                title: t('logout.error_title'),
                description: t('logout.error_desc'),
            });
        }
    };

    if (isUserLoading) {
        return <Button variant="ghost" size="icon" disabled><Loader2 className="h-5 w-5 animate-spin"/></Button>;
    }

    if (!user) {
        return (
            <Button variant="ghost" size="icon" asChild>
                <Link href="/account/login">
                    <UserIcon />
                    <span className="sr-only">{t('nav.login')}</span>
                </Link>
            </Button>
        );
    }
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/account">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>{t('nav.my_account')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export default function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Don't render header on admin or login pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return null;
  }
  
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
            
            <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />

            <UserNav />

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
