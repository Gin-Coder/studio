'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { useAuth, useFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { firestore } = useFirebase();
  const auth = useAuth();
  const { toast } = useToast();
  
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'auth_error') {
      toast({
        variant: 'destructive',
        title: "Erreur d'authentification",
        description: "Une erreur s'est produite lors de la connexion. Veuillez réessayer."
      });
    }

    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user && firestore) {
          // User has successfully signed in.
          const user = result.user;
          const userRef = doc(firestore, 'users', user.uid);
          
          try {
            await setDoc(userRef, {
              displayName: user.displayName,
              email: user.email,
              lastLogin: serverTimestamp(),
            }, { merge: true });
             router.push('/admin');
          } catch(e) {
            console.error("Failed to update user profile:", e);
            router.push('/login?error=firestore_error');
          }

        } else {
            setIsLoggingIn(false);
        }
      })
      .catch((error) => {
        console.error('Google sign-in error:', error);
        router.push('/login?error=auth_error');
      });
  }, [auth, router, firestore, toast, searchParams]);
  

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  if (isLoggingIn) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
             <p className="mt-4 text-muted-foreground">{t('login.logging_in')}</p>
        </div>
      )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <Link href="/" className="mb-4 inline-block">
                <Logo className="mx-auto" />
            </Link>
          <CardTitle className="text-2xl font-bold">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.google_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={handleGoogleLogin} className="w-full" disabled={isLoggingIn}>
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 264.1 0 127.9 111.8 16 244 16c73.2 0 136.2 29.3 181.9 76.5l-64.4 64.4C337.5 118.9 296.3 96 244 96c-80.5 0-146 65.5-146 168.1s65.5 168.1 146 168.1c94.3 0 128.3-72.1 132.8-109.9H244V261.8h244z"></path>
              </svg>
              {t('login.google_button')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
