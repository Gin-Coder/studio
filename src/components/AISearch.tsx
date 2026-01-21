
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
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/use-language';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from './ui/button';
import type { Product } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, or } from 'firebase/firestore';

interface SearchResult {
  slug: string;
  name: string;
  price: number;
  image: string;
}

interface AISearchProps {
  isDialog?: boolean;
}

export function AISearch({ isDialog = false }: AISearchProps) {
  const { t, language } = useLanguage();
  const { currency, convertPrice } = useCurrency();
  const [open, setOpen] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const firestore = useFirestore();

    const searchProducts = useCallback((searchQuery: string) => {
        if (!firestore || searchQuery.length < 2) {
            setResults([]);
            return;
        }

        startTransition(async () => {
            try {
                const lowerCaseQuery = searchQuery.toLowerCase();
                 // This is a simplified search. For a more robust solution, a dedicated search service like Algolia or Typesense is recommended.
                const productsRef = collection(firestore, 'products');
                const q = query(productsRef, 
                    or(
                      where('name', '>=', lowerCaseQuery),
                      where('name', '<=', lowerCaseQuery + '\uf8ff'),
                      where('tags', 'array-contains', lowerCaseQuery)
                    ),
                    where('status', '==', 'published'),
                    limit(5)
                );
                
                const { getDocs } = await import('firebase/firestore');
                const querySnapshot = await getDocs(q);

                const searchResults: SearchResult[] = [];
                querySnapshot.forEach((doc) => {
                    const product = doc.data() as Product;
                     if (product.name.toLowerCase().includes(lowerCaseQuery) || product.tags.some(t => t.toLowerCase().includes(lowerCaseQuery))) {
                         searchResults.push({
                            slug: product.slug,
                            name: product.name,
                            price: product.price,
                            image: product.images[0],
                        });
                     }
                });

                setResults(searchResults);
            } catch (error) {
                console.error("Error performing search:", error);
                setResults([]);
            }
        });
    }, [firestore]);


  useEffect(() => {
    if (open) {
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const debouncedFetchResults = useCallback(debounce(searchProducts, 300), [searchProducts]);

  const handleQueryChange = (searchQuery: string) => {
    setQueryText(searchQuery);
    debouncedFetchResults(searchQuery);
  };
  
  const closeAndClear = () => {
    setOpen(false);
    setQueryText('');
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
                value={queryText}
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
            <span className="inline-flex lg:hidden">{t('nav.mobile_search_placeholder')}</span>
          </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        {SearchContent}
      </PopoverContent>
    </Popover>
  );
}
