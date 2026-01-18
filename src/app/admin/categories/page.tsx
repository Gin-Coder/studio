
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { slugify } from '@/lib/utils';
import type { Category } from '@/lib/types';

// The state for the category form
type CategoryFormState = {
  id?: string;
  nameKey: string;
  imageUrl: string;
  imageHint: string;
};

// Helper for image upload
async function uploadCategoryImage(imageAsDataUrl: string): Promise<string> {
    const storage = getStorage();
    const imageRef = ref(storage, `categories/${Date.now()}-${Math.random()}`);
    await uploadString(imageRef, imageAsDataUrl, 'data_url');
    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
}

export default function AdminCategoriesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const categoriesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'categories') : null), [firestore]);
  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryFormState | null>(null);
  
  // State for deletion confirmation, only stores the ID
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(null);

  const isEditing = useMemo(() => !!currentCategory?.id, [currentCategory]);

  // Derived state to find the full category object to delete
  const categoryToDelete = useMemo(() => {
    if (!categoryIdToDelete || !categories) return null;
    return categories.find(c => c.id === categoryIdToDelete);
  }, [categoryIdToDelete, categories]);


  const openNewDialog = () => {
    setCurrentCategory({ nameKey: '', imageUrl: '', imageHint: 'category' });
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setCurrentCategory({
      id: category.id,
      nameKey: category.nameKey,
      imageUrl: category.imageUrl,
      imageHint: category.imageHint,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (categoryId: string) => {
    setCategoryIdToDelete(categoryId);
  };

  const handleFieldChange = (field: keyof CategoryFormState, value: string) => {
    if (currentCategory) {
      setCurrentCategory({ ...currentCategory, [field]: value });
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentCategory) {
        const reader = new FileReader();
        reader.onloadend = () => {
            handleFieldChange('imageUrl', reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!firestore || !currentCategory || !currentCategory.nameKey) {
        toast({ variant: 'destructive', title: "Le nom est requis" });
        return;
    }
    setIsSaving(true);

    const processSave = async (imageUrl: string) => {
        try {
            if (!currentCategory) return;
            const categoryId = currentCategory.id || slugify(currentCategory.nameKey);
            const categoryRef = doc(firestore, 'categories', categoryId);

            const categoryData = {
                nameKey: currentCategory.nameKey,
                imageUrl: imageUrl || `https://picsum.photos/seed/${categoryId}/600/400`,
                imageHint: currentCategory.imageHint || currentCategory.nameKey,
            };

            if (isEditing) {
                updateDoc(categoryRef, categoryData);
                toast({ title: 'Catégorie mise à jour' });
            } else {
                setDoc(categoryRef, categoryData);
                toast({ title: 'Catégorie créée' });
            }
            setDialogOpen(false);
        } catch (error: any) {
            console.error("Error saving category:", error);
            toast({ variant: 'destructive', title: "Erreur lors de l'enregistrement", description: error.message });
            if (error.code === 'permission-denied' && currentCategory) {
                const categoryRef = doc(firestore, 'categories', currentCategory.id || 'new');
                errorEmitter.emit('permission-error', new FirestorePermissionError({
                    path: categoryRef.path,
                    operation: isEditing ? 'update' : 'create',
                }));
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (currentCategory.imageUrl.startsWith('data:')) {
        uploadCategoryImage(currentCategory.imageUrl)
            .then(processSave)
            .catch(error => {
                console.error("Error uploading image:", error);
                toast({ variant: 'destructive', title: "Erreur de téléversement", description: error.message });
                setIsSaving(false);
            });
    } else {
        processSave(currentCategory.imageUrl);
    }
  };

  const handleDelete = async () => {
    if (!firestore || !categoryIdToDelete) return;
    
    const categoryRef = doc(firestore, 'categories', categoryIdToDelete);
    
    try {
        await deleteDoc(categoryRef);
        toast({ title: "Catégorie supprimée" });
    } catch (error: any) {
        console.error("Error deleting category:", error);
        toast({ variant: 'destructive', title: "Erreur de suppression", description: error.message });
        if (error.code === 'permission-denied') {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: categoryRef.path,
                operation: 'delete',
            }));
        }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Catégories</h1>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une catégorie
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gérer les catégories</CardTitle>
          <CardDescription>Ajoutez, modifiez ou supprimez les catégories de votre boutique.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={3} className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" /></TableCell></TableRow>
              )}
              {categories?.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image alt={cat.nameKey} className="aspect-square rounded-md object-cover" height="64" src={cat.imageUrl || 'https://placehold.co/64x64'} width="64" />
                  </TableCell>
                  <TableCell className="font-medium">{cat.nameKey}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Ouvrir menu</span></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(cat)}><Pencil className="mr-2 h-4 w-4" /> Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDeleteDialog(cat.id)}><Trash2 className="mr-2 h-4 w-4" /> Supprimer</DropdownMenuItem>
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
            <DialogTitle>{isEditing ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la catégorie</Label>
              <Input id="name" value={currentCategory?.nameKey || ''} onChange={(e) => handleFieldChange('nameKey', e.target.value)} placeholder="Ex: Vêtements pour hommes" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">URL de l'image</Label>
              <Input id="imageUrl" value={currentCategory?.imageUrl.startsWith('data:') ? '' : currentCategory?.imageUrl || ''} onChange={(e) => handleFieldChange('imageUrl', e.target.value)} placeholder="https://exemple.com/image.png" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageFile">Ou téléverser une image</Label>
              <Input id="imageFile" type="file" accept="image/*" onChange={handleImageFileChange} />
              {currentCategory?.imageUrl && (
                  <div className="relative mt-2 w-24 h-24 group">
                      <Image src={currentCategory.imageUrl} alt="Aperçu" fill className="rounded-md object-cover" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Dialog>
                              <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-white hover:text-white">
                                      <Eye className="h-5 w-5" />
                                  </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                      <DialogTitle>Aperçu de l'image</DialogTitle>
                                  </DialogHeader>
                                  <div className="relative aspect-video mt-4">
                                      <Image src={currentCategory.imageUrl} alt="Aperçu en grand" fill className="rounded-md object-contain"/>
                                  </div>
                              </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="icon" className="text-white hover:text-destructive" onClick={() => handleFieldChange('imageUrl', '')}>
                              <Trash2 className="h-5 w-5" />
                          </Button>
                      </div>
                  </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageHint">Indice pour l'IA (optionnel)</Label>
              <Input id="imageHint" value={currentCategory?.imageHint || ''} onChange={(e) => handleFieldChange('imageHint', e.target.value)} placeholder="Ex: clothing rack" />
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
      <AlertDialog open={!!categoryIdToDelete} onOpenChange={(open) => !open && setCategoryIdToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La catégorie "{categoryToDelete?.nameKey}" sera définitivement supprimée.
              Les produits associés ne seront pas supprimés mais devront être réassignés à une autre catégorie.
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
