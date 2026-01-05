import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MoreVertical, Edit, Trash } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const userReviews = [
    { id: 'r1', product: 'Elegant White Summer Dress', imageUrl: 'https://picsum.photos/seed/prod-1/200/200', rating: 5, text: 'Absolutely beautiful! The fabric is so light and comfortable.', date: '2023-08-15' },
    { id: 'r2', product: 'White Leather Sneakers', imageUrl: 'https://picsum.photos/seed/prod-7/200/200', rating: 4, text: 'Really love these sneakers. Very comfortable for walking around all day.', date: '2023-08-22' },
];

export default function AccountReviewsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Reviews</CardTitle>
                <CardDescription>Manage the reviews you have submitted.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {userReviews.map(review => (
                    <div key={review.id} className="flex gap-4 rounded-lg border p-4">
                        <Image src={review.imageUrl} alt={review.product} width={80} height={80} className="rounded-md object-cover" data-ai-hint="clothing item"/>
                        <div className="flex-grow">
                            <div className="flex justify-between">
                                <h3 className="font-semibold">{review.product}</h3>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive"><Trash className="mr-2 h-4 w-4"/> Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-accent text-accent' : 'fill-muted'}`} />
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground italic">"{review.text}"</p>
                            <p className="mt-2 text-xs text-muted-foreground">{review.date}</p>
                        </div>
                    </div>
                ))}

                 {userReviews.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">You haven't written any reviews yet.</p>
                    </div>
                )}
            </CardContent>
        