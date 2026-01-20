'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spline, Loader2, MoreHorizontal } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { Product, Variant } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

type FlattenedVariant = Variant & {
  productName: string;
  productId: string;
  productSlug: string;
  mainImage: string;
};

export default function AdminVariantsPage() {
  const firestore = useFirestore();
  
  const productsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const allVariants: FlattenedVariant[] = products?.flatMap(p => 
    p.variants.map(v => ({
      ...v,
      productId: p.id,
      productName: p.name,
      productSlug: p.slug,
      mainImage: p.images[0],
    }))
  ) || [];

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Gestion des variantes</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Toutes les variantes de produits</CardTitle>
          <CardDescription>Vue d'ensemble de chaque variante individuelle de produit dans votre boutique.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Produit Parent</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Couleur</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-48">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && allVariants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-48">
                    <Spline className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Aucune variante trouvée.</p>
                  </TableCell>
                </TableRow>
              )}
              {allVariants.map(variant => (
                <TableRow key={variant.id}>
                  <TableCell>
                    <Image
                      alt={variant.productName}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={variant.imageUrl || variant.mainImage || 'https://placehold.co/64x64'}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{variant.productName}</TableCell>
                  <TableCell><Badge variant="outline">{variant.size}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: variant.color }} />
                       {variant.colorName}
                    </div>
                  </TableCell>
                  <TableCell>{variant.stock}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/edit/${variant.productId}`}>
                        Modifier Produit
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
