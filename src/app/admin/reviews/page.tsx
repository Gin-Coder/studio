
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MoreHorizontal, Check, X, Trash2, Star, MessageSquareQuote } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Review, Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';

const StatusBadge = ({ status }: { status: Review['status'] }) => {
    const { t } = useLanguage();

    const variant: "default" | "secondary" | "destructive" = useMemo(() => {
        switch (status) {
            case 'approved': return 'default';
            case 'pending': return 'secondary';
            case 'rejected': return 'destructive';
            default: return 'secondary';
        }
    }, [status]);
    
    const text = useMemo(() => {
        switch (status) {
            case 'approved': return t('admin.reviews.status.approved');
            case 'pending': return t('admin.reviews.status.pending');
            case 'rejected': return t('admin.reviews.status.rejected');
            default: return status;
        }
    }, [status, t]);

    return <Badge variant={variant}>{text}</Badge>
}

export default function AdminReviewsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const reviewsQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'reviews') : null), [firestore]);
  const { data: reviews, isLoading: isLoadingReviews } = useCollection<Review>(reviewsQuery);
  
  const productsQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'products') : null), [firestore]);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const productMap = useMemo(() => {
    return new Map(products?.map(p => [p.id, p.nameKey]) || []);
  }, [products]);

  const handleUpdateStatus = (reviewId: string, status: Review['status']) => {
    if (!firestore) return;
    const reviewRef = doc(firestore, 'reviews', reviewId);
    updateDoc(reviewRef, { status })
      .then(() => toast({ title: "Statut mis à jour" }))
      .catch(error => errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: reviewRef.path,
          operation: 'update',
          requestResourceData: { status }
      })));
  };

  const handleDelete = (reviewId: string) => {
     if (!firestore) return;
    const reviewRef = doc(firestore, 'reviews', reviewId);
    deleteDoc(reviewRef)
      .then(() => toast({ title: "Avis supprimé" }))
      .catch(error => errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: reviewRef.path,
          operation: 'delete'
      })));
  }

  const isLoading = isLoadingReviews || isLoadingProducts;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('admin.reviews.title')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.reviews.title')}</CardTitle>
          <CardDescription>{t('admin.reviews.desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.reviews.table.product')}</TableHead>
                <TableHead>{t('admin.reviews.table.user')}</TableHead>
                <TableHead className="text-center">{t('admin.reviews.table.rating')}</TableHead>
                <TableHead>{t('admin.reviews.table.comment')}</TableHead>
                <TableHead>{t('admin.reviews.table.status')}</TableHead>
                <TableHead><span className="sr-only">{t('admin.reviews.table.actions')}</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={6} className="text-center h-48"><Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" /></TableCell></TableRow>
              )}
               {!isLoading && (!reviews || reviews.length === 0) && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-48">
                        <MessageSquareQuote className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Aucun avis pour le moment.</p>
                    </TableCell>
                </TableRow>
              )}
              {reviews?.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    <Link href={`/shop/${products?.find(p=>p.id === review.productId)?.slug || ''}`} className="hover:underline" target="_blank">
                        {t(productMap.get(review.productId) || review.productId)}
                    </Link>
                  </TableCell>
                  <TableCell>{review.userName}</TableCell>
                   <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                        {review.rating} <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{review.title}</p>
                    <p className="text-muted-foreground text-xs truncate max-w-xs">{review.comment}</p>
                  </TableCell>
                  <TableCell><StatusBadge status={review.status} /></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Ouvrir menu</span></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('admin.reviews.table.actions')}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(review.id, 'approved')}><Check className="mr-2 h-4 w-4" /> {t('admin.reviews.approve')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(review.id, 'rejected')}><X className="mr-2 h-4 w-4" /> {t('admin.reviews.reject')}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(review.id)}><Trash2 className="mr-2 h-4 w-4" /> {t('admin.reviews.delete')}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
