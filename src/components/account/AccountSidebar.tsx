'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, ShoppingBag, Star, Heart, LogOut } from 'lucide-react';

const navItems = [
  { href: '/account', label: 'My Profile', icon: User },
  { href: '/account/orders', label: 'My Orders', icon: ShoppingBag },
  { href: '/account/reviews', label: 'My Reviews', icon: Star },
  { href: '/account/saved-outfits', label: 'Saved Outfits', icon: Heart },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 md:pr-8">
      <nav className="flex flex-row gap-2 md:flex-col md:gap-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? 'default' : 'ghost'}
            className="justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          </Button>
        ))}
        <Button variant="ghost" className="justify-start text-destructive hover:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </nav>
    </