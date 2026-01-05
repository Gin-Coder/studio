
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartOff } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/hooks/use-language";

// Mock data
const savedOutfits = [
    { id: 'o1', name: 'Summer Brunch Look', date: '2023-09-01', items: [
        { name: 'Elegant White Summer Dress', imageId: 'prod-1' },
        { name: 'Stylish Sunglasses', imageId: 'prod-13' },
    ]},
    { id: 'o2', name: 'City Night Out', date: '2023-09-05', items: [
        { name: 'Classic Black Leather Jacket', imageId: 'prod-2' },
        { name: 'Blue Denim Jeans', imageId: 'prod-3' },
        { name: 'Brown Leather Boots', imageId: 'prod-8' },
    ]},
];

export default function SavedOutfitsPage() {
    const { t } = useLanguage();
    return (
         <Card>
            <CardHeader>
                <CardTitle>{t('account.outfits.title')}</CardTitle>
                <CardDescription>{t('account.outfits.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {savedOutfits.map(outfit => (
                    <div key={outfit.id} className="rounded-lg border p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">{outfit.name}</h3>
                                <p className="text-sm text-muted-foreground">{t('account.outfits.saved_on')} {outfit.date}</p>
                            </div>
                            <div className="flex gap-2">
                               <Button variant="outline" size="sm">{t('account.outfits.view')}</Button>
                               <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><HeartOff className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            {outfit.items.map(item => {
                                const image = PlaceHolderImages.find(p => p.id === item.imageId);
                                return (
                                <div key={item.name} className="relative h-16 w-16" title={item.name}>
                                    {image && <Image src={image.imageUrl} alt={item.name} layout="fill" className="rounded-md object-cover" data-ai-hint="clothing item" />}
                                </div>
                            )})}
                        </div>
                    </div>
                ))}
                
                {savedOutfits.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">{t('account.outfits.empty')}</p>
                        <p className="text-sm text-muted-foreground">{t('account.outfits.empty_desc')}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
