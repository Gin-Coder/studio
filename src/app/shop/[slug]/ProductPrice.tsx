
'use client';
import { useLanguage } from '@/hooks/use-language';
import { useCurrency } from '@/hooks/use-currency';
import { formatPrice } from '@/lib/utils';

export default function ProductPrice({ price }: { price: number }) {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  return <p className="mt-4 font-sans text-3xl font-semibold">{formatPrice(price, language, currency)}</p>;
}
