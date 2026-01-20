'use client';

import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useLanguage } from '@/hooks/use-language';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname, useSearchParams } from 'next/navigation';
import { dictionaries } from '@/lib/dictionaries';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';

const NavLink = ({ href, name, isActive }: { href: string; name: string; isActive: boolean }) => {
    return (
        <Link 
            href={href} 
            className={cn(
                "relative text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap px-4 h-full flex items-center",
                isActive && "text-primary"
            )}
        >
            {name}
            {isActive && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />}
        </Link>
    );
};

const CategoryNavContent = () => {
    const { t } = useLanguage();
    const firestore = useFirestore();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get('category');

    const categoriesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'categories') : null), [firestore]);
    const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);
    
    const isHiddenPage = pathname.startsWith('/admin') || pathname.startsWith('/login');
    if (isHiddenPage) {
        return null;
    }

    const getCategoryDisplayName = (category: Category) => {
        const key = category.nameKey;
        if (key && key.includes('.')) {
            return t(key);
        }
        
        const enDict = dictionaries['en'];
        const lowerKey = key ? key.toLowerCase() : '';
        if (!lowerKey) return '';

        const categoryKeys = Object.keys(enDict).filter(k => k.startsWith('filter.'));

        const foundKey = categoryKeys.find(k => {
            const dictValueLower = enDict[k].toLowerCase();
            const lengthRatio = Math.min(lowerKey.length, dictValueLower.length) / Math.max(lowerKey.length, dictValueLower.length);

            if (lengthRatio >= 0.8) {
                 if (dictValueLower.startsWith(lowerKey) || lowerKey.startsWith(dictValueLower)) {
                     return true;
                 }
            }
            return false;
        });

        if (foundKey) {
            return t(foundKey);
        }
        
        return t(key);
    };
    
    const isShopPage = pathname.startsWith('/shop');
    // The "All" link is active only on the shop page without a category filter.
    const isAllActive = isShopPage && !activeCategory;
    

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm sticky top-[64px] z-40">
            <div className="container mx-auto flex h-12 items-center justify-start px-4">
                <div className="flex items-center -ml-4 overflow-x-auto no-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center space-x-8 pl-4">
                            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-5 w-24 rounded" />)}
                        </div>
                    ) : (
                        <>
                            <NavLink href="/shop" name={t('nav.all')} isActive={isAllActive} />
                            {categories?.map(category => (
                                <NavLink 
                                    key={category.id} 
                                    href={`/shop?category=${category.id}`} 
                                    name={getCategoryDisplayName(category)} 
                                    isActive={activeCategory === category.id && isShopPage} 
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

// Top-level component needs to use Suspense because of useSearchParams
export default function CategoryNav() {
  return (
    <Suspense fallback={<div className="h-12 border-b bg-background" />}>
      <CategoryNavContent />
    </Suspense>
  )
}
