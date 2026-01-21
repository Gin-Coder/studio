'use client';

import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/use-language';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Package, User as UserIcon } from 'lucide-react';

export default function AccountPage() {
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const { toast } = useToast();
    const { t } = useLanguage();

    useEffect(() => {
        // If loading is finished and there's no user, redirect to login
        if (!isUserLoading && !user) {
            router.push('/account/login');
        }
    }, [user, isUserLoading, router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({
                title: t('logout.success_title'),
                description: t('logout.success_desc'),
            });
            router.push('/');
        } catch (error) {
            console.error("Logout Error: ", error);
            toast({
                variant: "destructive",
                title: t('logout.error_title'),
                description: t('logout.error_desc'),
            });
        }
    };

    if (isUserLoading || !user) {
        return (
            <div className="container mx-auto py-12">
                <div className="mx-auto max-w-2xl space-y-8">
                   <Skeleton className="h-10 w-1/2" />
                   <Card>
                       <CardHeader>
                           <Skeleton className="h-7 w-1/3" />
                           <Skeleton className="h-4 w-2/3" />
                       </CardHeader>
                       <CardContent>
                           <Skeleton className="h-5 w-full" />
                       </CardContent>
                   </Card>
                   <Card>
                       <CardHeader>
                            <Skeleton className="h-7 w-1/4" />
                       </CardHeader>
                       <CardContent>
                           <Skeleton className="h-20 w-full" />
                       </CardContent>
                   </Card>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-12">
            <div className="mx-auto max-w-2xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">{t('account.title')}</h1>
                    <p className="text-muted-foreground">{t('account.welcome', { name: user.displayName || user.email || '' })}</p>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UserIcon /> {t('account.details_title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('account.display_name')}</p>
                            <p>{user.displayName}</p>
                        </div>
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('account.email')}</p>
                            <p>{user.email}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Package /> {t('account.orders_title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center text-center p-12">
                        <p className="text-muted-foreground">{t('account.no_orders')}</p>
                        <Button variant="outline" className="mt-4" onClick={() => router.push('/shop')}>
                            {t('cart.continue_shopping')}
                        </Button>
                    </CardContent>
                </Card>

                <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.logout')}
                </Button>
            </div>
        </div>
    );
}
