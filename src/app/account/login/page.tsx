'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { useAuth, useFirebase, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { firestore } = useFirebase();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [isPopupProcessing, setIsPopupProcessing] = useState(false);

  useEffect(() => {
    // If auth state is determined and there is a user, redirect them.
    if (!isUserLoading && user) {
      router.push('/account');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleLogin = async () => {
    if (!auth || !firestore) return;
    
    setIsPopupProcessing(true);
    const provider = new GoogleAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        const loggedInUser = result.user;
        const userRef = doc(firestore, 'users', loggedInUser.uid);

        const userData = {
            displayName: loggedInUser.displayName || loggedInUser.email?.split('@')[0],
            email: loggedInUser.email,
            lastLogin: serverTimestamp(),
        };

        // Use setDoc with merge:true to create or update.
        // This is safe and won't overwrite existing fields like 'role'.
        await setDoc(userRef, userData, { merge: true });

        toast({
            title: t('login.customer.success_title'),
            description: t('login.customer.success_desc', { name: loggedInUser.displayName || loggedInUser.email || '' }),
        });
        
        router.push('/account');

    } catch (error: any) {
        console.error("Google Popup Login Error:", error);
        if (error.code !== 'auth/popup-closed-by-user') {
            toast({
                variant: 'destructive',
                title: t('login.error_title'),
                description: error.message || t('login.error_desc'),
            });
        }
    } finally {
        setIsPopupProcessing(false);
    }
  };
  
  const isLoading = isUserLoading || isPopupProcessing;

  if (isUserLoading || (!isUserLoading && user)) {
     return (
        <div className="container flex min-h-[60vh] items-center justify-center py-12">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
     );
  }

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <Link href="/" className="mb-4 inline-block">
                <Logo className="mx-auto" />
            </Link>
          <CardTitle className="text-2xl font-bold">{t('login.customer.title')}</CardTitle>
          <CardDescription>{t('login.customer.desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleLogin} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('login.processing')}
              </>
            ) : t('login.google_button')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
