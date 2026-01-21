
'use client';
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice, slugify } from "@/lib/utils";
import { useCurrency } from "@/hooks/use-currency";
import { useLanguage } from "@/hooks/use-language";
import { PlusCircle, MoreHorizontal, Loader2, Upload, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, deleteDoc, doc, getDocs, writeBatch, serverTimestamp, addDoc } from "firebase/firestore";
import type { Product, Category } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function AdminProductsPage() {
  const { currency, convertPrice } = useCurrency();
  const { t, language } = useLanguage();
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'products') : null), [firestore]);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);
  const categoriesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'categories') : null), [firestore]);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

  const { toast } = useToast();

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const productToDelete = useMemo(() => {
    if (!productIdToDelete || !products) return null;
    return products.find(p => p.id === productIdToDelete);
  }, [productIdToDelete, products]);
  
  const categoryMap = useMemo(() => {
    if (!categories) return new Map<string, string>();
    return new Map(categories.map(cat => [cat.id, cat.nameKey]));
  }, [categories]);

  const isLoading = isLoadingProducts || isLoadingCategories;


  const handleDeleteProduct = () => {
    if (!productIdToDelete || !firestore) return;
    const productDocRef = doc(firestore, 'products', productIdToDelete);
    
    deleteDoc(productDocRef)
      .then(() => {
        toast({
          title: "Produit supprimé",
          description: `Le produit a été supprimé avec succès.`,
        });
      })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: productDocRef.path,
            operation: 'delete',
        }));
      })
      .finally(() => {
        setProductIdToDelete(null);
      });
  };

  const handleDeleteSelected = () => {
    if (!firestore || selectedProductIds.length === 0) return;
    
    const batch = writeBatch(firestore);
    selectedProductIds.forEach(id => {
        const docRef = doc(firestore, 'products', id);
        batch.delete(docRef);
    });

    batch.commit()
      .then(() => {
        toast({
            title: `${selectedProductIds.length} produits supprimés`,
            description: "Les produits sélectionnés ont été supprimés avec succès.",
        });
      })
      .catch((error) => {
        toast({
            variant: "destructive",
            title: "Erreur de suppression",
            description: "Une erreur est survenue lors de la suppression des produits.",
        });
      })
      .finally(() => {
        setSelectedProductIds([]);
        setIsBulkDeleteOpen(false);
      });
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setImportFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!importFile || !firestore) return;

    setIsImporting(true);
    try {
        const fileContent = await importFile.text();
        const productsToImport: Partial<Product>[] = JSON.parse(fileContent);

        if (!Array.isArray(productsToImport)) {
            throw new Error("Le fichier JSON doit contenir un tableau de produits.");
        }
        
        // This is a complex operation with multiple writes.
        // For simplicity in this context, we will use a batch and catch any final error.
        // A more granular error handling would require iterating and catching each write.
        const batch = writeBatch(firestore);
        
        const productsCollection = collection(firestore, 'products');
        productsToImport.forEach(productData => {
            if (!productData.name || !productData.price || !productData.category) {
                console.warn("Skipping invalid product data:", productData);
                return; 
            }
            const newProductRef = doc(productsCollection); 
            const completeProductData = {
                ...productData,
                slug: productData.slug || slugify(productData.name),
                rating: productData.rating ?? 0,
                reviewCount: productData.reviewCount ?? 0,
                status: productData.status || 'draft',
                imageHints: productData.imageHints || [],
                tags: productData.tags || [],
                variants: productData.variants || [],
                images: productData.images || ['https://placehold.co/600x800'],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            batch.set(newProductRef, completeProductData);
        });

        await batch.commit();
        
        toast({
            title: "Importation réussie",
            description: `${productsToImport.length} produits ont été importés avec succès.`
        });

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erreur d'importation",
            description: error.message || "Impossible d'importer le fichier de produits. Vérifiez les permissions et le format du fichier.",
        });
    } finally {
        setIsImporting(false);
        setIsImportOpen(false);
        setImportFile(null);
    }
};


  return (
    <>
      <div className="flex items-center justify-between gap-4">
        {selectedProductIds.length > 0 ? (
            <>
                <h1 className="text-xl font-semibold text-muted-foreground">
                    {selectedProductIds.length} produit(s) sélectionné(s)
                </h1>
                <Button variant="destructive" onClick={() => setIsBulkDeleteOpen(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer la sélection
                </Button>
            </>
        ) : (
            <>
                <h1 className="text-3xl font-bold">Produits</h1>
                <div className="flex gap-2">
                    <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                      <DialogTrigger asChild>
                          <Button variant="outline">
                              <Upload className="mr-2 h-4 w-4" />
                              Importer en masse
                          </Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Importer des produits en masse</DialogTitle>
                              <DialogDescription>
                                  Téléversez un fichier JSON pour ajouter plusieurs produits à la fois.
                                  Le fichier doit être un tableau d'objets produits.
                              </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                  <Label htmlFor="import-file">Fichier JSON</Label>
                                  <Input id="import-file" type="file" accept=".json" onChange={handleFileSelect} />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                  <a href="/products-example.json" download className="underline hover:text-primary">
                                    Téléchargez un exemple de fichier JSON
                                  </a> pour voir le format requis.
                              </p>
                          </div>
                          <DialogFooter>
                              <Button variant="outline" onClick={() => setIsImportOpen(false)}>Annuler</Button>
                              <Button onClick={handleImport} disabled={!importFile || isImporting}>
                                  {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  {isImporting ? "Importation..." : "Importer les produits"}
                              </Button>
                          </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button asChild>
                      <Link href="/admin/products/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un produit
                      </Link>
                    </Button>
                </div>
            </>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des produits</CardTitle>
          <CardDescription>Gérez vos produits ici. Vous pouvez ajouter, modifier ou supprimer des produits.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead padding="checkbox" className="w-12">
                  <Checkbox
                    checked={products && selectedProductIds.length === products.length}
                    onCheckedChange={(checked) => {
                      if (checked && products) {
                        setSelectedProductIds(products.map(p => p.id));
                      } else {
                        setSelectedProductIds([]);
                      }
                    }}
                    aria-label="Tout sélectionner"
                  />
                </TableHead>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {products && products.map((product) => (
                <TableRow key={product.id} data-state={selectedProductIds.includes(product.id) && "selected"}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProductIds.includes(product.id)}
                      onCheckedChange={(checked) => {
                        setSelectedProductIds(
                          checked
                            ? [...selectedProductIds, product.id]
                            : selectedProductIds.filter(id => id !== product.id)
                        );
                      }}
                      aria-label="Sélectionner la ligne"
                    />
                  </TableCell>
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
                    <Badge variant="outline">{product.status}</Badge>
                  </TableCell>
                  <TableCell>{formatPrice(convertPrice(product.price), language, currency)}</TableCell>
                  <TableCell>{t(categoryMap.get(product.category) || product.category)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/products/edit/${product.id}`}>Modifier</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => setProductIdToDelete(product.id)}
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!productIdToDelete} onOpenChange={(open) => !open && setProductIdToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit "{productToDelete?.name}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression en masse</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Vous êtes sur le point de supprimer définitivement {selectedProductIds.length} produit(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected}>
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
