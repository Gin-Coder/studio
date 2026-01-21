'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { useAuth, useFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { firestore } = useFirebase();
  const auth = useAuth();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!auth || !firestore) return;

    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          const user = result.user;
          const userRef = doc(firestore, 'users', user.uid);
          // Only create/update the profile, don't add admin roles here.
          await setDoc(userRef, {
            displayName: user.displayName || user.email?.split('@')[0],
            email: user.email,
            lastLogin: serverTimestamp(),
          }, { merge: true });
          
          toast({
            title: t('login.customer.success_title'),
            description: t('login.customer.success_desc', { name: user.displayName || user.email || '' }),
          });
          router.push('/account'); // Redirect to customer account page
        } else {
          // If no redirect result, check if user is already logged in
          if (auth.currentUser) {
            router.push('/account'); // Already logged in, go to account page
          } else {
            setIsProcessing(false); // Not logged in, show login button
          }
        }
      })
      .catch((error) => {
        console.error("Google Login Redirect Error:", error);
        toast({
          variant: 'destructive',
          title: t('login.error_title'),
          description: t('login.error_desc'),
        });
        setIsProcessing(false);
      });
  }, [auth, firestore, router, toast, t]);

  const handleGoogleLogin = () => {
    if (!auth) return;
    setIsProcessing(true);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };
  
  const loginButtonContent = () => {
    if (isProcessing) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('login.processing')}
        </>
      );
    }
    return t('login.google_button');
  };


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
          <Button onClick={handleGoogleLogin} className="w-full" disabled={isProcessing}>
            {loginButtonContent()}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
