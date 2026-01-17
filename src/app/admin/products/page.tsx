
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
import { PlusCircle, MoreHorizontal, Loader2, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, deleteDoc, doc, writeBatch } from "firebase/firestore";
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function AdminProductsPage() {
  const { currency, convertPrice } = useCurrency();
  const { t, language } = useLanguage();
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'products') : null), [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsQuery);
  const { toast } = useToast();

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);


  const handleDeleteProduct = async () => {
    if (!productToDelete || !firestore) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(firestore, 'products', productToDelete.id));
      toast({
        title: "Produit supprimé",
        description: `Le produit "${productToDelete.name}" a été supprimé.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "La suppression du produit a échoué.",
      });
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

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

          const batch = writeBatch(firestore);
          const productsCollection = collection(firestore, 'products');

          productsToImport.forEach(productData => {
              if (!productData.name || !productData.price || !productData.category) {
                  console.warn("Skipping invalid product data:", productData);
                  return; 
              }
              const newProductRef = doc(productsCollection);
              batch.set(newProductRef, {
                  ...productData,
                  slug: productData.slug || slugify(productData.name),
                  rating: productData.rating || 0,
                  reviewCount: productData.reviewCount || 0,
                  status: productData.status || 'draft',
                  imageHints: productData.imageHints || [],
                  tags: productData.tags || [],
                  variants: productData.variants || [],
                  images: productData.images || ['https://placehold.co/600x800'],
              });
          });

          await batch.commit();

          toast({
              title: "Importation réussie",
              description: `${productsToImport.length} produits ont été importés avec succès.`,
          });
          setIsImportOpen(false);
          setImportFile(null);
      } catch (error: any) {
          console.error("Failed to import products:", error);
          toast({
              variant: "destructive",
              title: "Erreur d'importation",
              description: error.message || "Impossible d'importer le fichier de produits.",
          });
      } finally {
          setIsImporting(false);
      }
  };


  return (
    <>
      <div className="flex items-center justify-between gap-4">
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
                  <TableCell colSpan={6} className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && products && products.map((product) => (
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
                    <Badge variant="outline">{product.status}</Badge>
                  </TableCell>
                  <TableCell>{formatPrice(convertPrice(product.price), language, currency)}</TableCell>
                  <TableCell>{t(`filter.${product.category}`)}</TableCell>
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
                          onClick={() => setProductToDelete(product)}
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
      
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit "{productToDelete?.name}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)} disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
