
'use client';

import { useCurrency } from '@/hooks/use-currency';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DollarSign, Euro, LandPlot } from 'lucide-react';
import { useEffect, useState } from 'react';

const currencyIcons = {
  USD: <DollarSign className="h-[1.2rem] w-[1.2rem]" />,
  EUR: <Euro className="h-[1.2rem] w-[1.2rem]" />,
  HTG: <LandPlot className="h-[1.2rem] w-[1.2rem]" />, // Placeholder icon for Gourde
};

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <DollarSign className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Change currency</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change currency">
          {currencyIcons[currency]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setCurrency('USD')} disabled={currency === 'USD'}>
          USD ($)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency('EUR')} disabled={currency === 'EUR'}>
          EUR (€)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency('HTG')} disabled={currency === 'HTG'}>
          HTG (G)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
