
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, PlusCircle, Loader2, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useDoc, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Category, Product, SubCategory } from '@/lib/types';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { slugify, stringToColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

type VariantFormState = {
    id: number;
    size: string;
    color: string;
    stock: string;
    imageUrl: string;
};

async function uploadImage(imageAsDataUrl: string): Promise<string> {
    const storage = getStorage();
    const imageRef = ref(storage, `products/${Date.now()}-${Math.random()}`);
    await uploadString(imageRef, imageAsDataUrl, 'data_url');
    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
}

const EditProductSkeleton = () => (
    <div className="mx-auto grid w-full max-w-6xl flex-1 auto-rows-max gap-4 p-4 sm:px-6">
        <Skeleton className="h-10 w-1/2" />
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    </div>
);


export default function EditProductPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();
    const firestore = useFirestore();

    const productQuery = useMemoFirebase(() => (firestore ? doc(firestore, 'products', id) : null), [firestore, id]);
    const { data: product, isLoading: isLoadingProduct } = useDoc<Product>(productQuery);

    const categoriesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'categories') : null), [firestore]);
    const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

    const subCategoriesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'subcategories') : null), [firestore]);
    const { data: subCategories, isLoading: isLoadingSubCategories } = useCollection<SubCategory>(subCategoriesQuery);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [variants, setVariants] = useState<VariantFormState[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [status, setStatus] = useState('draft');
    const [categoryId, setCategoryId] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [price, setPrice] = useState('');
    const [priceCurrency, setPriceCurrency] = useState('USD');
    
    const [newCategoryName, setNewCategoryName] = useState('');
    
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingCategory, setIsSavingCategory] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description || '');
            setLongDescription(product.longDescription || '');
            setPrice(product.price.toString());
            setPriceCurrency('USD');
            setStatus(product.status);
            setCategoryId(product.category);
            setSubCategoryId(product.subCategory || '');
            setImageUrl(product.images[0] || '');
            setVariants(product.variants.map((v, i) => ({
                id: i, // Use index as a simple key
                size: v.size,
                color: v.colorName,
                stock: v.stock.toString(),
                imageUrl: v.imageUrl || ''
            })));
        }
    }, [product]);
    
    const availableSubCategories = useMemo(() => {
        if (!categoryId || !subCategories) return [];
        return subCategories.filter(sc => sc.parentCategory === categoryId);
    }, [categoryId, subCategories]);

    useEffect(() => {
        // If the current subcategory doesn't belong to the new category, reset it
        if (subCategoryId && !availableSubCategories.some(sc => sc.id === subCategoryId)) {
            setSubCategoryId('');
        }
    }, [categoryId, subCategoryId, availableSubCategories]);

    const handleVariantChange = (index: number, field: keyof Omit<VariantFormState, 'id'>, value: string) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { id: Date.now(), size: '', color: '', stock: '10', imageUrl: '' }]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAddNewCategory = async () => {
        if (newCategoryName.trim() === '') {
            toast({ variant: 'destructive', title: "Erreur", description: "Le nom de la catégorie ne peut pas être vide." });
            return;
        }

        if (categories?.some(cat => cat.id === slugify(newCategoryName))) {
             toast({ variant: 'destructive', title: "Erreur", description: "Cette catégorie existe déjà." });
             return;
        }
        
        if (!firestore) {
            toast({ variant: "destructive", title: "Erreur de connexion", description: "La base de données n'est pas disponible." });
            return;
        }

        setIsSavingCategory(true);
        const newCategoryId = slugify(newCategoryName);
        const categoryRef = doc(firestore, "categories", newCategoryId);
        
        const newCategoryData = {
            nameKey: newCategoryName,
            imageUrl: 'https://placehold.co/600x400',
            imageHint: 'placeholder'
        };

        try {
            await setDoc(categoryRef, newCategoryData)
            setCategoryId(newCategoryId);
            setNewCategoryName('');
            toast({ title: "Catégorie ajoutée", description: `La catégorie "${newCategoryName}" a été ajoutée.` });
        } catch (error) {
            console.error("Error adding category to Firestore:", error);
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: categoryRef.path,
                operation: 'create',
                requestResourceData: newCategoryData,
            }));
        } finally {
            setIsSavingCategory(false);
        }
    };


    const handleSaveProduct = async () => {
        if (!firestore || !name || !price || !categoryId || !subCategoryId) {
            toast({ variant: "destructive", title: "Champs requis manquants", description: "Veuillez remplir le nom, le prix, la catégorie et la sous-catégorie." });
            return;
        }
        setIsSaving(true);

        try {
            let finalImageUrl = imageUrl;
            if (imageUrl.startsWith('data:')) {
                finalImageUrl = await uploadImage(imageUrl);
            }

            const finalVariants = await Promise.all(variants.map(async (v) => {
                let variantImageUrl = v.imageUrl;
                if (v.imageUrl && v.imageUrl.startsWith('data:')) {
                    variantImageUrl = await uploadImage(v.imageUrl);
                }
                return {
                    id: `${slugify(name)}-${slugify(v.size)}-${slugify(v.color)}`,
                    size: v.size,
                    color: stringToColor(v.color),
                    colorName: v.color,
                    stock: parseInt(v.stock, 10) || 0,
                    imageUrl: variantImageUrl,
                }
            }));
            
            const CONVERSION_RATES: Record<string, number> = { USD: 1, EUR: 0.93, HTG: 135 };
            const rate = CONVERSION_RATES[priceCurrency] || 1;
            const priceInUSD = parseFloat(price) / rate;

            const productDataForFirestore = {
                name,
                slug: slugify(name),
                description: description,
                longDescription: longDescription,
                price: priceInUSD,
                category: categoryId,
                subCategory: subCategoryId,
                status,
                variants: finalVariants,
                images: [finalImageUrl, ...finalVariants.map(v => v.imageUrl).filter(Boolean)],
                imageHints: ['user uploaded'],
                tags: [categoryId, subCategoryId],
                updatedAt: serverTimestamp(),
            };
            
            const productRef = doc(firestore, "products", id);
            
            await setDoc(productRef, productDataForFirestore, { merge: true });
            toast({ title: "Produit mis à jour !", description: `Le produit "${name}" a été mis à jour avec succès.` });
            router.push('/admin/products');

        } catch (error: any) {
             console.error("Failed to save product:", error);
             const productRef = doc(firestore, "products", id);
             errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: productRef.path,
                operation: 'update',
            }));
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/products');
    };

    if (isLoadingProduct && !product) {
        return <EditProductSkeleton />;
    }

    if (!product) {
        notFound();
    }

  return (
    <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-col sm:gap-4 sm:py-4">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="mx-auto grid w-full max-w-6xl flex-1 auto-rows-max gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                            <Link href="/admin/products">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Retour</span>
                            </Link>
                        </Button>
                        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            Modifier le produit
                        </h1>
                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                Annuler
                            </Button>
                            <Button size="sm" onClick={handleSaveProduct} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Détails du produit</CardTitle>
                                    <CardDescription>
                                        Informations générales et image principale du produit.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">Nom</Label>
                                            <Input id="name" type="text" className="w-full" placeholder="Ex: T-shirt en coton" value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="description">Description courte</Label>
                                            <Textarea id="description" placeholder="Courte description pour la liste des produits." className="min-h-24" value={description} onChange={(e) => setDescription(e.target.value)} />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="long-description">Description longue</Label>
                                            <Textarea id="long-description" placeholder="Description détaillée pour la page du produit." className="min-h-32" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label>Image principale</Label>
                                            <Tabs defaultValue="upload" className="w-full">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="upload">Téléverser</TabsTrigger>
                                                    <TabsTrigger value="url">URL</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="upload">
                                                    <Input id="image-main-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setImageUrl)} />
                                                </TabsContent>
                                                <TabsContent value="url">
                                                    <Input id="image-main-url" type="url" placeholder="https://example.com/image.png" value={imageUrl.startsWith('data:') ? '' : imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                                                </TabsContent>
                                            </Tabs>
                                            {imageUrl && (
                                                <div className="relative mt-2 w-24 h-24 group">
                                                    <Image src={imageUrl} alt="Aperçu de l'image principale" fill className="rounded-md object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="text-white hover:text-white">
                                                                    <Eye className="h-5 w-5" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-3xl">
                                                                <DialogHeader>
                                                                    <DialogTitle>Aperçu de l'image principale</DialogTitle>
                                                                    <DialogDescription>Aperçu de l'image principale du produit.</DialogDescription>
                                                                </DialogHeader>
                                                                <div className="relative aspect-video mt-4">
                                                                    <Image src={imageUrl} alt="Aperçu en grand" fill className="rounded-md object-contain"/>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                        <Button variant="ghost" size="icon" className="text-white hover:text-destructive" onClick={() => setImageUrl('')}>
                                                            <Trash2 className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Variantes</CardTitle>
                                    <CardDescription> Ajoutez des variantes comme la taille, la couleur et une image spécifique. </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {variants.map((variant, index) => (
                                        <div key={variant.id} className="space-y-4 mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="grid gap-3">
                                                    <Label htmlFor={`size-${index}`}>Taille</Label>
                                                    <Input id={`size-${index}`} type="text" placeholder="Ex: M" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor={`color-${index}`}>Couleur</Label>
                                                    <Input id={`color-${index}`} type="text" placeholder="Ex: Noir" value={variant.color} onChange={(e) => handleVariantChange(index, 'color', e.target.value)} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor={`stock-${index}`}>Stock</Label>
                                                    <Input id={`stock-${index}`} type="number" placeholder="Ex: 25" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} />
                                                </div>
                                            </div>
                                             <div className="grid gap-3">
                                                <Label>Image de la variante</Label>
                                                <Tabs defaultValue="upload" className="w-full">
                                                    <TabsList className="grid w-full grid-cols-2">
                                                        <TabsTrigger value="upload">Téléverser</TabsTrigger>
                                                        <TabsTrigger value="url">URL</TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent value="upload">
                                                        <Input id={`variant-image-upload-${index}`} type="file" accept="image/*" onChange={(e) => handleFileChange(e, (url) => handleVariantChange(index, 'imageUrl', url))} />
                                                    </TabsContent>
                                                    <TabsContent value="url">
                                                        <Input id={`variant-image-url-${index}`} type="url" placeholder="https://example.com/image.png" value={variant.imageUrl.startsWith('data:') ? '' : variant.imageUrl} onChange={(e) => handleVariantChange(index, 'imageUrl', e.target.value)} />
                                                    </TabsContent>
                                                </Tabs>
                                                {variant.imageUrl && (
                                                    <div className="relative mt-2 w-24 h-24 group">
                                                        <Image src={variant.imageUrl} alt={`Aperçu variante ${index + 1}`} fill className="rounded-md object-cover" />
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="text-white hover:text-white">
                                                                        <Eye className="h-5 w-5" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-3xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Aperçu de l'image de la variante</DialogTitle>
                                                                        <DialogDescription>Aperçu de l'image de la variante.</DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="relative aspect-video mt-4">
                                                                        <Image src={variant.imageUrl} alt="Aperçu en grand" fill className="rounded-md object-contain"/>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Button variant="ghost" size="icon" className="text-white hover:text-destructive" onClick={() => handleVariantChange(index, 'imageUrl', '')}>
                                                                <Trash2 className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <Button size="sm" variant="outline" className="mt-4" onClick={addVariant}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Ajouter une variante
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statut du produit</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="status">Statut</Label>
                                            <Select value={status} onValueChange={setStatus}>
                                                <SelectTrigger id="status" aria-label="Sélectionner le statut">
                                                    <SelectValue placeholder="Sélectionner le statut" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="draft">Brouillon</SelectItem>
                                                    <SelectItem value="published">Publié</SelectItem>
                                                    <SelectItem value="archived">Archivé</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Organisation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="price">Prix</Label>
                                            <div className="flex items-center gap-2">
                                                <Input id="price" type="number" placeholder="99.99" value={price} onChange={(e) => setPrice(e.target.value)}/>
                                                <Select value={priceCurrency} onValueChange={setPriceCurrency}>
                                                    <SelectTrigger className="w-[120px]"> <SelectValue placeholder="Devise" /> </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="USD">USD</SelectItem>
                                                        <SelectItem value="EUR">EUR</SelectItem>
                                                        <SelectItem value="HTG">HTG</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="category">Catégorie</Label>
                                            <Select value={categoryId} onValueChange={setCategoryId} disabled={isLoadingCategories}>
                                                <SelectTrigger id="category" aria-label="Sélectionner une catégorie">
                                                    <SelectValue placeholder={isLoadingCategories ? "Chargement..." : "Sélectionner une catégorie"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories?.map(cat => ( <SelectItem key={cat.id} value={cat.id}>{t(cat.nameKey)}</SelectItem> ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="subcategory">Sous-catégorie</Label>
                                            <Select value={subCategoryId} onValueChange={setSubCategoryId} disabled={!categoryId || isLoadingSubCategories}>
                                                <SelectTrigger id="subcategory" aria-label="Sélectionner une sous-catégorie">
                                                    <SelectValue placeholder={!categoryId ? "Choisissez d'abord une catégorie" : "Sélectionner une sous-catégorie"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableSubCategories.map(sc => ( <SelectItem key={sc.id} value={sc.id}>{t(sc.nameKey)}</SelectItem> ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-3 border-t pt-4">
                                            <Label htmlFor="new-category">Ajouter une nouvelle catégorie</Label>
                                            <div className="flex items-center gap-2">
                                               <Input id="new-category" placeholder="Nom de la catégorie" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                                               <Button size="icon" variant="outline" onClick={handleAddNewCategory} aria-label="Ajouter la catégorie" disabled={isSavingCategory}>
                                                    {isSavingCategory ? <Loader2 className="h-4 w-4 animate-spin"/> : <PlusCircle className="h-4 w-4" />}
                                               </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 md:hidden">
                        <Button variant="outline" size="sm" onClick={handleCancel}>Annuler</Button>
                        <Button size="sm" onClick={handleSaveProduct} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
}
