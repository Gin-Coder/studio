
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { Product, Category } from '@/lib/types';
import { Package, Shapes, PlusCircle, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import { useLanguage } from '@/hooks/use-language';
import { Skeleton } from '@/components/ui/skeleton';

const StatCardSkeleton = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-6" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-1" />
        </CardContent>
    </Card>
);

const RecentProductsSkeleton = () => (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
            <CardTitle>Produits récents</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

export default function AdminDashboard() {
  const firestore = useFirestore();
  const { language } = useLanguage();
  const { currency, convertPrice } = useCurrency();

  const productsQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'products') : null), [firestore]);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const categoriesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'categories') : null), [firestore]);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

  const recentProducts = useMemo(() => {
    if (!products) return [];
    
    const sortableProducts = [...products];

    sortableProducts.sort((a, b) => {
        const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate().getTime() : 0;
        const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate().getTime() : 0;
        return dateB - dateA;
    });

    return sortableProducts.slice(0, 5);
  }, [products]);
  
  const isLoading = isLoadingProducts || isLoadingCategories;

  return (
    <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
            <div className="flex items-center space-x-2">
                 <Button asChild variant="outline">
                    <Link href="/" target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Voir la boutique
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un produit
                    </Link>
                </Button>
            </div>
        </div>
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
            <>
                <StatCardSkeleton />
                <StatCardSkeleton />
            </>
        ) : (
            <>
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total des Produits</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{products?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Nombre total de produits dans la boutique</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total des Catégories</CardTitle>
                    <Shapes className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{categories?.length || 0}</div>
                     <p className="text-xs text-muted-foreground">Nombre total de catégories de produits</p>
                  </CardContent>
                </Card>
            </>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? <RecentProductsSkeleton /> : (
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Produits Récemment Modifiés</CardTitle>
                <CardDescription>
                  Les 5 derniers produits ajoutés ou mis à jour.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="hidden md:table-cell">Prix</TableHead>
                            <TableHead className="hidden md:table-cell">Dernière MàJ</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentProducts?.map(product => (
                            <TableRow key={product.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                      alt={product.name}
                                      className="aspect-square rounded-md object-cover"
                                      height="64"
                                      src={product.images[0] || 'https://placehold.co/64x64'}
                                      width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    <Badge variant={product.status === 'published' ? 'default' : 'outline'}>{product.status}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{formatPrice(convertPrice(product.price), language, currency)}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {product.updatedAt?.toDate().toLocaleDateString(language)}
                                </TableCell>
                                <TableCell>
                                     <Button aria-haspopup="true" size="sm" variant="outline" asChild>
                                        <Link href={`/admin/products/edit/${product.id}`}>
                                            Modifier
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}
