
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Language, Currency } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, lang: Language = 'en', currency: Currency = 'USD') {
    // Note: HTG might not be a standard ISO code recognized by all browsers for formatting.
    // We'll display it as is if formatting fails.
    try {
        return new Intl.NumberFormat(lang, {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(price);
    } catch (e) {
        if (currency === 'HTG') {
            return `${price.toFixed(2)} HTG`;
        }
        return new Intl.NumberFormat(lang, {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price);
    }
}
