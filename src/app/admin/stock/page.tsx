'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Warehouse, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { Product, Variant } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import debounce from 'lodash.debounce';

export default function AdminStockPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const productsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const [savingStatus, setSavingStatus] = useState<Record<string, 'saving' | 'saved' | 'error'>>({});

  const handleStockChange = (productId: string, variantId: string, newStock: string) => {
    const stockValue = parseInt(newStock, 10);
    if (!isNaN(stockValue)) {
      const updateKey = `${productId}-${variantId}`;
      setStockUpdates(prev => ({ ...prev, [updateKey]: stockValue }));
      debouncedSaveStock(productId, variantId, stockValue);
    }
  };

  const saveStock = async (productId: string, variantId: string, newStock: number) => {
    if (!firestore) return;
    
    const updateKey = `${productId}-${variantId}`;
    setSavingStatus(prev => ({ ...prev, [updateKey]: 'saving' }));

    const productRef = doc(firestore, 'products', productId);
    const product = products?.find(p => p.id === productId);
    if (!product) return;

    const newVariants = product.variants.map(v => 
      v.id === variantId ? { ...v, stock: newStock } : v
    );

    try {
      await updateDoc(productRef, { variants: newVariants });
      setSavingStatus(prev => ({ ...prev, [updateKey]: 'saved' }));
      setTimeout(() => setSavingStatus(prev => ({ ...prev, [updateKey]: undefined })), 2000); // Reset after 2s
    } catch (error: any) {
      console.error("Error updating stock:", error);
      toast({ variant: 'destructive', title: "Erreur de mise à jour", description: `Le stock pour la variante ${variantId} n'a pas pu être mis à jour.` });
      setSavingStatus(prev => ({ ...prev, [updateKey]: 'error' }));
      if (error.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: productRef.path,
              operation: 'update',
              requestResourceData: { variants: newVariants },
          }));
      }
    }
  };

  const debouncedSaveStock = debounce(saveStock, 1000);

  const getStatusIcon = (status: 'saving' | 'saved' | 'error' | undefined) => {
    switch (status) {
      case 'saving': return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      case 'saved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Gestion des stocks</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Niveaux de stock actuels</CardTitle>
          <CardDescription>Affichez et mettez à jour rapidement les quantités de stock pour chaque variante de produit.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Variante (Taille/Couleur)</TableHead>
                <TableHead className="w-[150px]">Stock Actuel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-48">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
               {!isLoading && (!products || products.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-48">
                    <Warehouse className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Aucun produit trouvé.</p>
                  </TableCell>
                </TableRow>
              )}
              {products?.flatMap(product =>
                product.variants.map(variant => (
                  <TableRow key={`${product.id}-${variant.id}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Image src={variant.imageUrl || product.images[0] || 'https://placehold.co/40x40'} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                        <span>{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{variant.size} / {variant.colorName}</TableCell>
                    <TableCell>
                      <div className="relative">
                        <Input
                          type="number"
                          defaultValue={variant.stock}
                          onChange={(e) => handleStockChange(product.id, variant.id, e.target.value)}
                          className="pr-8"
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center">
                          {getStatusIcon(savingStatus[`${product.id}-${variant.id}`])}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
