
'use client';

import { useState, useTransition, useCallback, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/use-language';
import { searchProducts } from '@/ai/flows/product-search-flow';
import type { ProductSearchResult } from '@/ai/flows/product-search-flow';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from './ui/button';

interface AISearchProps {
  isDialog?: boolean;
}

export function AISearch({ isDialog = false }: AISearchProps) {
  const { t, language } = useLanguage();
  const { currency, convertPrice } = useCurrency();
  const [open, setOpen] = useState(isDialog);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
        // slight delay to allow dialog to render
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const fetchResults = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      const searchResults = await searchProducts({ query: searchQuery, lang: language });
      setResults(searchResults);
    });
  };

  const debouncedFetchResults = useCallback(debounce(fetchResults, 300), [language]);

  const handleQueryChange = (searchQuery: string) => {
    setQuery(searchQuery);
    debouncedFetchResults(searchQuery);
  };
  
  const closeAndClear = () => {
    setOpen(false);
    setQuery('');
    setResults([]);
  }

  const SearchContent = (
      <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
             <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                ref={inputRef}
                placeholder={t('nav.search_placeholder')}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-0 focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                value={query}
                onValueChange={handleQueryChange}
              />
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          <CommandList>
            <CommandEmpty>{t('search.no_results')}</CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading={t('search.suggestions')}>
                {results.map((product) => (
                  <CommandItem key={product.slug} value={product.name} onSelect={closeAndClear}>
                    <Link href={`/shop/${product.slug}`} className="flex items-center w-full gap-4">
                       <div className="relative w-12 h-16 rounded-md overflow-hidden flex-shrink-0">
                         <Image src={product.image} alt={product.name} fill className="object-cover"/>
                       </div>
                       <div className="flex flex-col overflow-hidden">
                         <p className="font-medium truncate">{product.name}</p>
                         <p className="text-sm text-muted-foreground">{formatPrice(convertPrice(product.price), language, currency)}</p>
                       </div>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
  );

  if (isDialog) {
    return SearchContent;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
         <Button
             variant="outline"
             className="w-full md:w-[200px] lg:w-[320px] justify-start text-sm text-muted-foreground"
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline-flex">{t('nav.search_placeholder')}</span>
            <span className="inline-flex lg:hidden">Search...</span>
          </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        {SearchContent}
      </PopoverContent>
    </Popover>
  );
}
