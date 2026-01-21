
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { slugify } from '@/lib/utils';
import type { Category, SubCategory } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';

type SubCategoryFormState = {
  id?: string;
  nameKey: string;
  parentCategory: string;
};

export default function AdminSubCategoriesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const subCategoriesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'subcategories') : null), [firestore]);
  const { data: subCategories, isLoading: isLoadingSubCategories } = useCollection<SubCategory>(subCategoriesQuery);
  
  const categoriesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'categories') : null), [firestore]);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategoryFormState | null>(null);
  
  const [subCategoryIdToDelete, setSubCategoryIdToDelete] = useState<string | null>(null);

  const isEditing = useMemo(() => !!currentSubCategory?.id, [currentSubCategory]);

  const subCategoryToDelete = useMemo(() => {
    if (!subCategoryIdToDelete || !subCategories) return null;
    return subCategories.find(sc => sc.id === subCategoryIdToDelete);
  }, [subCategoryIdToDelete, subCategories]);

  const categoryMap = useMemo(() => {
    return new Map(categories?.map(c => [c.id, c.nameKey]) || []);
  }, [categories]);


  const openNewDialog = () => {
    setCurrentSubCategory({ nameKey: '', parentCategory: '' });
    setDialogOpen(true);
  };

  const openEditDialog = (subCategory: SubCategory) => {
    setCurrentSubCategory({
      id: subCategory.id,
      nameKey: subCategory.nameKey,
      parentCategory: subCategory.parentCategory,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (subCategoryId: string) => {
    setSubCategoryIdToDelete(subCategoryId);
  };

  const handleFieldChange = (field: keyof SubCategoryFormState, value: string) => {
    if (currentSubCategory) {
      setCurrentSubCategory({ ...currentSubCategory, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!firestore || !currentSubCategory || !currentSubCategory.nameKey || !currentSubCategory.parentCategory) {
        toast({ variant: 'destructive', title: "Champs requis manquants", description: "Le nom et la catégorie parente sont requis." });
        return;
    }
    setIsSaving(true);

    const subCategoryData = {
        nameKey: currentSubCategory.nameKey,
        parentCategory: currentSubCategory.parentCategory,
    };

    const id = currentSubCategory.id || slugify(`${subCategoryData.nameKey}-${subCategoryData.parentCategory}`);
    const subCategoryRef = doc(firestore, 'subcategories', id);

    try {
        await setDoc(subCategoryRef, subCategoryData, { merge: true });
        toast({ title: isEditing ? 'Sous-catégorie mise à jour' : 'Sous-catégorie créée' });
        setDialogOpen(false);
    } catch (error: any) {
        console.error("Error saving subcategory:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: subCategoryRef.path,
            operation: isEditing ? 'update' : 'create',
            requestResourceData: subCategoryData,
        }));
    } finally {
        setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!firestore || !subCategoryIdToDelete) return;
    
    const subCategoryRef = doc(firestore, 'subcategories', subCategoryIdToDelete);
    try {
        await deleteDoc(subCategoryRef);
        toast({ title: "Sous-catégorie supprimée" });
    } catch(error: any) {
        console.error("Error deleting subcategory:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: subCategoryRef.path,
            operation: 'delete',
        }));
    } finally {
        setSubCategoryIdToDelete(null);
    }
  };
  
  const isLoading = isLoadingSubCategories || isLoadingCategories;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Sous-catégories</h1>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une sous-catégorie
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gérer les sous-catégories</CardTitle>
          <CardDescription>Ajoutez des sous-catégories pour mieux organiser vos produits.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie Parente</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={3} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" /></TableCell></TableRow>
              )}
              {subCategories?.map((sc) => (
                <TableRow key={sc.id}>
                  <TableCell className="font-medium">{sc.nameKey}</TableCell>
                  <TableCell>{t(categoryMap.get(sc.parentCategory) || sc.parentCategory)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Ouvrir menu</span></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(sc)}><Pencil className="mr-2 h-4 w-4" /> Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDeleteDialog(sc.id)}><Trash2 className="mr-2 h-4 w-4" /> Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifier la sous-catégorie' : 'Ajouter une sous-catégorie'}</DialogTitle>
            <DialogDescription>
                {isEditing ? "Modifiez les détails de la sous-catégorie." : "Ajoutez une nouvelle sous-catégorie et liez-la à une catégorie parente."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la sous-catégorie</Label>
              <Input id="name" value={currentSubCategory?.nameKey || ''} onChange={(e) => handleFieldChange('nameKey', e.target.value)} placeholder="Ex: Homme, Femme, Enfant" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parentCategory">Catégorie Parente</Label>
               <Select value={currentSubCategory?.parentCategory} onValueChange={(value) => handleFieldChange('parentCategory', value)} disabled={isLoadingCategories}>
                  <SelectTrigger id="parentCategory" aria-label="Sélectionner une catégorie parente">
                      <SelectValue placeholder={isLoadingCategories ? "Chargement..." : "Sélectionner une catégorie"} />
                  </SelectTrigger>
                  <SelectContent>
                      {categories?.map(cat => ( <SelectItem key={cat.id} value={cat.id}>{t(cat.nameKey)}</SelectItem> ))}
                  </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Alert for Delete Confirmation */}
      <AlertDialog open={!!subCategoryIdToDelete} onOpenChange={(open) => !open && setSubCategoryIdToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La sous-catégorie "{subCategoryToDelete?.nameKey}" sera définitivement supprimée.
              Les produits associés devront être réassignés à une autre sous-catégorie.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
