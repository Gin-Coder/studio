'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, ShoppingBag, Star, Heart, LogOut } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useLanguage } from '@/hooks/use-language';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';

export function AccountSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { auth } = useFirebase();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { href: '/account', label: t('account.sidebar.profile'), icon: User },
    { href: '/account/orders', label: t('account.sidebar.orders'), icon: ShoppingBag },
    { href: '/account/reviews', label: t('account.sidebar.reviews'), icon: Star },
    { href: '/account/saved-outfits', label: t('account.sidebar.outfits'), icon: Heart },
  ];

  return (
    <aside className="w-full md:w-64 md:pr-8">
      <ScrollArea className="w-full whitespace-nowrap md:whitespace-normal">
        <nav className="flex flex-row gap-2 md:flex-col md:gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? 'default' : 'ghost'}
              className="justify-start shrink-0"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </Link>
            </Button>
          ))}
          <Button variant="ghost" className="justify-start text-destructive hover:text-destructive shrink-0" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('account.sidebar.signout')}
          </Button>
        </nav>
        <ScrollBar orientation="horizontal" className="md:hidden" />
      </ScrollArea>
    </aside>
  );
}
