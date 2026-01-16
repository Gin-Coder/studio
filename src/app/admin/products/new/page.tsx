
'use client';

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
import { categories } from '@/lib/mock-data';
import { useLanguage } from '@/hooks/use-language';

export default function NewProductPage() {
    const { t } = useLanguage();
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
                            <Button variant="outline" size="sm">
                                Annuler
                            </Button>
                            <Button size="sm">Enregistrer le produit</Button>
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
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="description">Description courte</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Courte description pour la liste des produits."
                                                className="min-h-24"
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="long-description">Description longue</Label>
                                            <Textarea
                                                id="long-description"
                                                placeholder="Description détaillée pour la page du produit."
                                                className="min-h-32"
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
                                    {/* Simplified variant management for now */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid gap-3">
                                            <Label htmlFor="size">Taille</Label>
                                            <Input id="size" type="text" placeholder="Ex: M"/>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="color">Couleur</Label>
                                            <Input id="color" type="text" placeholder="Ex: Noir"/>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="stock">Stock</Label>
                                            <Input id="stock" type="number" placeholder="Ex: 25"/>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="mt-4">
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
                                        <Input id="image-url" type="text" placeholder="https://..." />
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
                                            <Select>
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
                                    <CardTitle>Catégorie & Prix</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="category">Catégorie</Label>
                                            <Select>
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
                                        <div className="grid gap-3">
                                            <Label htmlFor="price">Prix (USD)</Label>
                                            <Input id="price" type="number" placeholder="99.99" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 md:hidden">
                        <Button variant="outline" size="sm">
                            Annuler
                        </Button>
                        <Button size="sm">Enregistrer le produit</Button>
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
}
