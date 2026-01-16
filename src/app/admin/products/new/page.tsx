
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { categories as mockCategories } from '@/lib/mock-data';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

type VariantFormState = {
    size: string;
    color: string;
    stock: string;
};

export default function NewProductPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const { toast } = useToast();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [variants, setVariants] = useState<VariantFormState[]>([{ size: '', color: '', stock: '10' }]);
    const [imageUrl, setImageUrl] = useState('');
    const [status, setStatus] = useState('draft');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState('');

    const [categories, setCategories] = useState(mockCategories);
    const [newCategoryName, setNewCategoryName] = useState('');


    const handleVariantChange = (index: number, field: keyof VariantFormState, value: string) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { size: '', color: '', stock: '10' }]);
    };

    const handleAddNewCategory = () => {
        if (newCategoryName.trim() === '') {
            toast({
                variant: 'destructive',
                title: "Erreur",
                description: "Le nom de la catégorie ne peut pas être vide.",
            });
            return;
        }

        const newCatId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
        const newCategory = {
            id: newCatId,
            nameKey: newCategoryName,
            imageUrl: 'https://placehold.co/600x400',
            imageHint: 'placeholder'
        };

        if (categories.some(cat => cat.id === newCategory.id)) {
             toast({
                variant: 'destructive',
                title: "Erreur",
                description: "Cette catégorie existe déjà.",
            });
            return;
        }

        setCategories([...categories, newCategory]);
        setCategoryId(newCategory.id);
        setNewCategoryName('');
        toast({
            title: "Catégorie ajoutée",
            description: `La catégorie "${newCategoryName}" a été ajoutée.`,
        });
    };

    const handleSaveProduct = () => {
        if (!name || !price || !categoryId) {
            toast({
                variant: 'destructive',
                title: "Champs requis manquants",
                description: "Veuillez remplir le nom, le prix et la catégorie.",
            });
            return;
        }

        const newProduct = {
            id: Date.now().toString(),
            name,
            description,
            longDescription,
            price: parseFloat(price),
            category: categoryId,
            status,
            variants: variants.map(v => ({...v, stock: parseInt(v.stock, 10) || 0 })),
            images: [imageUrl],
        };

        console.log("Nouveau produit enregistré (simulation):", newProduct);
        
        toast({
            title: "Produit enregistré !",
            description: `Le produit "${name}" a été enregistré avec succès (simulation).`,
        });
        
        router.push('/admin/products');
    };

    const handleCancel = () => {
        router.push('/admin/products');
    };

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
                            Ajouter un nouveau produit
                        </h1>
                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                Annuler
                            </Button>
                            <Button size="sm" onClick={handleSaveProduct}>Enregistrer le produit</Button>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Détails du produit</CardTitle>
                                    <CardDescription>
                                        Informations générales sur le produit.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">Nom</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                className="w-full"
                                                placeholder="Ex: T-shirt en coton"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="description">Description courte</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Courte description pour la liste des produits."
                                                className="min-h-24"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="long-description">Description longue</Label>
                                            <Textarea
                                                id="long-description"
                                                placeholder="Description détaillée pour la page du produit."
                                                className="min-h-32"
                                                value={longDescription}
                                                onChange={(e) => setLongDescription(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Variantes</CardTitle>
                                    <CardDescription>
                                        Ajoutez des variantes comme la taille ou la couleur.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {variants.map((variant, index) => (
                                        <div key={index} className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0">
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
                                    ))}
                                    <Button size="sm" variant="outline" className="mt-4" onClick={addVariant}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Ajouter une variante
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Média</CardTitle>
                                    <CardDescription>
                                        Ajoutez les images pour votre produit.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3">
                                        <Label htmlFor="image-url">URL de l'image principale</Label>
                                        <Input id="image-url" type="text" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                                    </div>
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
                                            <Label htmlFor="category">Catégorie</Label>
                                            <Select value={categoryId} onValueChange={setCategoryId}>
                                                <SelectTrigger
                                                    id="category"
                                                    aria-label="Sélectionner une catégorie"
                                                >
                                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat.id} value={cat.id}>{t(cat.nameKey)}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-3 border-t pt-4">
                                            <Label htmlFor="new-category">Ajouter une nouvelle catégorie</Label>
                                            <div className="flex items-center gap-2">
                                               <Input id="new-category" placeholder="Nom de la catégorie" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                                               <Button size="icon" variant="outline" onClick={handleAddNewCategory} aria-label="Ajouter la catégorie"><PlusCircle className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="price">Prix (USD)</Label>
                                            <Input id="price" type="number" placeholder="99.99" value={price} onChange={(e) => setPrice(e.target.value)}/>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 md:hidden">
                        <Button variant="outline" size="sm" onClick={handleCancel}>
                            Annuler
                        </Button>
                        <Button size="sm" onClick={handleSaveProduct}>Enregistrer le produit</Button>
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
}
