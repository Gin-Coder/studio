
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Spline, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function AdminVariantsPage() {
  const firestore = useFirestore();
  
  const productsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Gestion des variantes</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Variantes par produit</CardTitle>
          <CardDescription>
            Cliquez sur un produit pour voir et gérer ses variantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isLoading && (!products || products.length === 0) && (
            <div className="text-center h-48 flex flex-col justify-center items-center">
              <Spline className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Aucun produit trouvé pour afficher les variantes.</p>
            </div>
          )}
          
          <Accordion type="single" collapsible className="w-full">
            {products?.map(product => (
              <AccordionItem value={product.id} key={product.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4">
                     <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="48"
                        src={product.images[0] || 'https://placehold.co/48x48'}
                        width="48"
                      />
                      <div className="text-left">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.variants.length} variante(s)</p>
                      </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <div className="flex justify-end mb-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/products/edit/${product.id}`}>
                                Gérer le produit complet
                            </Link>
                        </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[64px]">Image</TableHead>
                          <TableHead>Taille</TableHead>
                          <TableHead>Couleur</TableHead>
                          <TableHead className="text-right">Stock</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.variants.map(variant => (
                          <TableRow key={variant.id}>
                            <TableCell>
                                <Image
                                    alt={variant.colorName}
                                    className="aspect-square rounded-md object-cover"
                                    height="40"
                                    src={variant.imageUrl || product.images[0] || 'https://placehold.co/40x40'}
                                    width="40"
                                />
                            </TableCell>
                            <TableCell><Badge variant="outline">{variant.size}</Badge></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                   <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: variant.color }} />
                                   {variant.colorName}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">{variant.stock}</TableCell>
                          </TableRow>
                        ))}
                         {product.variants.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    Ce produit n'a pas encore de variantes.
                                </TableCell>
                            </TableRow>
                         )}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

        </CardContent>
      </Card>
    </>
  );
}
