'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '../ui/button';
import { Github, Twitter, Instagram } from 'lucide-react';
import { LanguageSwitcher } from '../LanguageSwitcher';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-secondary">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <Logo className="bg-transparent backdrop-blur-none" />
          <div className="my-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">
              {t('nav.shop')}
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              {t('nav.contact')}
            </Link>
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="text-sm text-muted-foreground hover:text-foreground">
              Terms & Conditions
            </Link>
          </div>
        </div>

        <hr className="my-6 border-border" />

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Danny Store. {t('footer.rights')}
          </p>
          <div className="mt-4 flex items-center gap-x-4 sm:mt-0">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer"><Twitter /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer"><Instagram /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer"><Github /></a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
