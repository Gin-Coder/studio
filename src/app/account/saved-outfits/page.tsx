import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartOff } from "lucide-react";
import Image from "next/image";

// Mock data
const savedOutfits = [
    { id: 'o1', name: 'Summer Brunch Look', date: '2023-09-01', items: [
        { name: 'Elegant White Summer Dress', imageUrl: 'https://picsum.photos/seed/prod-1/100/100' },
        { name: 'Stylish Sunglasses', imageUrl: 'https://picsum.photos/seed/prod-13/100/100' },
    ]},
    { id: 'o2', name: 'City Night Out', date: '2023-09-05', items: [
        { name: 'Classic Black Leather Jacket', imageUrl: 'https://picsum.photos/seed/prod-2/100/100' },
        { name: 'Blue Denim Jeans', imageUrl: 'https://picsum.photos/seed/prod-3/100/100' },
        { name: 'Brown Leather Boots', imageUrl: 'https://picsum.photos/seed/prod-8/100/100' },
    ]},
];

export default function SavedOutfitsPage() {
    return (
         <Card>
            <CardHeader>
                <CardTitle>Saved Outfits</CardTitle>
                <CardDescription>Your favorite looks, saved from Virtual Try-On.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {savedOutfits.map(outfit => (
                    <div key={outfit.id} className="rounded-lg border p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">{outfit.name}</h3>
                                <p className="text-sm text-muted-foreground">Saved on {outfit.date}</p>
                            </div>
                            <div className="flex gap-2">
                               <Button variant="outline" size="sm">View</Button>
                               <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><HeartOff className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            {outfit.items.map(item => (
                                <div key={item.name} className="relative h-16 w-16" title={item.name}>
                                    <Image src={item.imageUrl} alt={item.name} layout="fill" className="rounded-md object-cover" data-ai-hint="clothing item" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                {savedOutfits.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">You haven't saved any outfits yet.</p>
                        <p className="text-sm text-muted-foreground">Use the Virtual Try-On feature to create and save looks.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}