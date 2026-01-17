
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Language, Currency } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, lang: Language = 'en', currency: Currency = 'USD') {
    // Note: HTG might not be a standard ISO code recognized by all browsers for formatting.
    // We'll display it with a "G" suffix as is common.
    try {
        if (currency === 'HTG') {
            return new Intl.NumberFormat(lang, {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(price) + ' G';
        }

        return new Intl.NumberFormat(lang, {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(price);
    } catch (e) {
        // Fallback for environments where currency support might be limited
        if (currency === 'HTG') {
            return `${Math.round(price)} G`;
        }
        return `${price.toFixed(2)} ${currency}`;
    }
}

export function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
