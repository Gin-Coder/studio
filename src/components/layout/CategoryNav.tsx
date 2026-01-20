
'use client';

import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useLanguage } from '@/hooks/use-language';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import { dictionaries } from '@/lib/dictionaries';

const CategoryLink = ({ category }: { category: Category }) => {
    const { t } = useLanguage();

    // This complex logic is needed to handle user-created categories vs. seeded ones
    const getCategoryDisplayName = (category: Category) => {
        const key = category.nameKey;
        if (key && key.includes('.')) { // It's already a translation key
            return t(key);
        }
        
        const enDict = dictionaries['en'];
        const lowerKey = key ? key.toLowerCase() : '';
        if (!lowerKey) return '';

        // Search within 'filter.' keys to be specific
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
        
        return t(key); // Fallback to the nameKey itself
    };
    
    return (
        <Link 
            href={`/shop?category=${category.id}`} 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap px-4 py-2"
        >
            {getCategoryDisplayName(category)}
        </Link>
    );
};

export default function CategoryNav() {
    const firestore = useFirestore();
    const categoriesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'categories') : null), [firestore]);
    const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);
    const pathname = usePathname();

    // Do not show on admin or login pages, similar to Footer
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
        return null;
    }

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm sticky top-[64px] z-40 hidden md:block">
            <div className="container mx-auto flex h-12 items-center justify-center px-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {isLoading && (
                        <div className="flex items-center space-x-8">
                            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-5 w-24 rounded" />)}
                        </div>
                    )}
                    {!isLoading && categories?.map(category => (
                        <CategoryLink key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </nav>
    );
}
