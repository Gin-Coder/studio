'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [isPopupProcessing, setIsPopupProcessing] = useState(false);

  useEffect(() => {
    // If auth state is determined and there is a user, redirect them.
    if (!isUserLoading && user) {
      toast({
          title: t('login.customer.success_title'),
          description: t('login.customer.success_desc', { name: user.displayName || user.email || '' }),
      });
      router.push('/account');
    }
  }, [user, isUserLoading, router, t, toast]);

  const handleGoogleLogin = () => {
    if (!auth) return;
    
    setIsPopupProcessing(true);
    const provider = new GoogleAuthProvider();
    
    // Fire-and-forget. Let the global onAuthStateChanged listener handle success.
    // We catch errors here just to update the UI and inform the user.
    signInWithPopup(auth, provider)
      .catch((error: any) => {
        console.error("Google Popup Login Error:", error);
        // Only show a toast for errors other than the user closing the popup.
        if (error.code !== 'auth/popup-closed-by-user') {
            toast({
                variant: 'destructive',
                title: t('login.error_title'),
                description: error.message || t('login.error_desc'),
            });
        }
      })
      .finally(() => {
        // This will run whether it succeeds or fails.
        // If it succeeds, the useEffect above will redirect.
        // If it fails, we stop the spinner.
        setIsPopupProcessing(false);
      });
  };
  
  const isLoading = isUserLoading || isPopupProcessing;

  // The main loading spinner logic. This will show a spinner while checking initial auth state,
  // AND after the login button is clicked. It will continue to show until the user is redirected.
  if (isLoading) {
     return (
        <div className="container flex min-h-[60vh] items-center justify-center py-12">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
     );
  }

  // If we are done loading and there is a user, we should be redirecting.
  // This helps prevent a flash of the login page if redirection is slow.
  if (!isUserLoading && user) {
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
