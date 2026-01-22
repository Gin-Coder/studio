
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Loader2 } from 'lucide-react';
import type { Review } from '@/lib/types';
import Link from 'next/link';

const StarRatingInput = ({ rating, setRating }: { rating: number, setRating: (rating: number) => void }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer transition-colors ${
                        star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-muted-foreground hover:text-yellow-400'
                    }`}
                    onClick={() => setRating(star)}
                />
            ))}
        </div>
    );
};


const ReviewForm = ({ productId, productNameKey }: { productId: string, productNameKey: string }) => {
    const { t } = useLanguage();
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !firestore) return;
        if (rating === 0 || !comment.trim()) {
            toast({ variant: 'destructive', title: "Champs requis", description: "Veuillez fournir une note et un commentaire." });
            return;
        }

        setIsSubmitting(true);
        const reviewsCollection = collection(firestore, 'reviews');
        
        const reviewData = {
            productId,
            userId: user.uid,
            userName: user.displayName || 'Anonymous',
            userAvatarUrl: user.photoURL || '',
            rating,
            title,
            comment,
            status: 'pending' as const,
            createdAt: serverTimestamp()
        };

        addDoc(reviewsCollection, reviewData)
            .then(() => {
                toast({
                    title: t('toast.review.submitted.title'),
                    description: t('toast.review.submitted.description'),
                });
                setRating(0);
                setTitle('');
                setComment('');
            })
            .catch(error => {
                errorEmitter.emit('permission-error', new FirestorePermissionError({
                    path: reviewsCollection.path,
                    operation: 'create',
                    requestResourceData: reviewData
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    if (!user) {
        return (
            <div className="text-center border-t pt-8 mt-8">
                <p className="text-muted-foreground">{t('product.login_to_review')}</p>
                <Button asChild className="mt-2">
                    <Link href="/account/login">
                        {t('nav.login')}
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>{t('product.write_review')}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>{t('product.your_rating')}</Label>
                        <StarRatingInput rating={rating} setRating={setRating} />
                    </div>
                     <div>
                        <Label htmlFor="review-title">{t('product.review_title')}</Label>
                        <Input id="review-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Incroyable !" />
                    </div>
                    <div>
                        <Label htmlFor="review-comment">{t('product.review_comment')}</Label>
                        <Textarea id="review-comment" value={comment} onChange={e => setComment(e.target.value)} placeholder="..." required />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('product.submit_review')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default function ReviewSection({ productId, productNameKey }: { productId: string, productNameKey: string }) {
    const { t } = useLanguage();
    const firestore = useFirestore();

    const reviewsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'reviews'),
            where('productId', '==', productId),
            where('status', '==', 'approved'),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, productId]);

    const { data: reviews, isLoading } = useCollection<Review>(reviewsQuery);

    return (
        <div id="reviews" className="mt-16">
            <h2 className="mb-8 text-center font-headline text-3xl font-bold">{t('product.customer_reviews')}</h2>
            
            <div className="mx-auto max-w-3xl space-y-8">
                {isLoading && <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />}

                {!isLoading && reviews?.length === 0 && (
                    <p className="text-center text-muted-foreground">Aucun avis pour ce produit pour le moment.</p>
                )}

                {reviews?.map(review => (
                    <div key={review.id} className="rounded-lg border p-6">
                        <div className="flex items-start">
                            <Image src={review.userAvatarUrl || '/default-avatar.png'} alt={review.userName} width={48} height={48} className="rounded-full bg-muted" />
                            <div className="ml-4">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">{review.userName}</p>
                                    <span className="text-xs text-muted-foreground">
                                        {review.createdAt?.toDate().toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="mt-1 flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i < review.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'fill-muted text-muted-foreground'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <h3 className="mt-2 font-semibold">{review.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mx-auto max-w-3xl mt-12">
                <ReviewForm productId={productId} productNameKey={productNameKey} />
            </div>
        </div>
    );
}
