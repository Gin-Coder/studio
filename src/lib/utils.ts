
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Language } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, lang: Language = 'en') {
    const currency = 'USD'; // Assuming USD for now
    return new Intl.NumberFormat(lang, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(price);
}
