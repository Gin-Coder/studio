
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

export default function LoginPage() {
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
          await setDoc(userRef, {
            displayName: user.displayName || user.email?.split('@')[0],
            email: user.email,
            lastLogin: serverTimestamp(),
          }, { merge: true });
          
          router.push('/admin');
        } else {
          if (auth.currentUser) {
            router.push('/admin');
          } else {
            setIsProcessing(false);
          }
        }
      })
      .catch((error) => {
        console.error("Google Login Redirect Error:", error);
        toast({
          variant: 'destructive',
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la connexion avec Google. Assurez-vous que les pop-ups sont autorisées.",
        });
        setIsProcessing(false);
      });
  }, [auth, firestore, router, toast]);

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
          Vérification en cours...
        </>
      );
    }
    return t('login.google_button');
  };


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
          <Button onClick={handleGoogleLogin} className="w-full" disabled={isProcessing}>
            {loginButtonContent()}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
