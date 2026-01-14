
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Currency } from '@/lib/types';

const CONVERSION_RATES = {
  USD: 1,
  EUR: 0.93, 
  HTG: 135,
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (price: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    const storedCurrency = localStorage.getItem('currency') as Currency;
    if (storedCurrency && ['USD', 'EUR', 'HTG'].includes(storedCurrency)) {
      setCurrencyState(storedCurrency);
    }
  }, []);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('currency', curr);
  };
  
  const convertPrice = useCallback((price: number) => {
      const rate = CONVERSION_RATES[currency];
      return price * rate;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
