
'use client';

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a stable placeholder on the server and initial client render
    return (
      <Button variant="ghost" size="icon" disabled>
        <Globe className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Change language</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('fr')} disabled={language === 'fr'}>
          Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ht')} disabled={language === 'ht'}>
          Kreyòl
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
