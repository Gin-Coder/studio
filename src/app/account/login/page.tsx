
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

  // This effect handles redirecting the user once they are successfully logged in.
  // It listens for changes to the `user` object provided by the global auth hook.
  useEffect(() => {
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
    
    signInWithPopup(auth, provider)
      .catch((error: any) => {
        console.error("Google Popup Login Error:", error);
        
        // Don't show an error toast if the user simply closed the popup.
        if (error.code !== 'auth/popup-closed-by-user') {
            toast({
                variant: 'destructive',
                title: t('login.error_title'),
                description: error.message || t('login.error_desc'),
            });
        }
      })
      .finally(() => {
        // Always stop the processing indicator once the flow is complete.
        setIsPopupProcessing(false);
      });
  };
  
  // The user is in a loading state if we're checking the initial auth state,
  // or if the popup login process has been initiated.
  const isLoading = isUserLoading || isPopupProcessing;

  // Show a full-page loader if we're in any loading state.
  // This prevents the user from seeing a flash of the login page if redirection is slow.
  if (isLoading || (!isUserLoading && user)) {
     return (
        <div className="container flex min-h-[60vh] items-center justify-center py-12">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
     );
  }

  // If we are done loading and there's no user, show the login form.
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
