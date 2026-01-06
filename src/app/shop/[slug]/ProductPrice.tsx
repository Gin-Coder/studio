
'use client';
import { useLanguage } from '@/hooks/use-language';
import { formatPrice } from '@/lib/utils';

export default function ProductPrice({ price }: { price: number }) {
  const { language } = useLanguage();
  return <p className="mt-4 font-sans text-3xl font-semibold">{formatPrice(price, language)}</p>;
}
