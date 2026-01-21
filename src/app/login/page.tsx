'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.86 2.25-4.82 2.25-4.04 0-7.3-3.35-7.3-7.4s3.26-7.4 7.3-7.4c2.28 0 3.68.92 4.5 1.75l2.7-2.7C18.44 2.16 15.87 1 12.48 1 7.02 1 3 5.02 3 10.5s4.02 9.5 9.48 9.5c2.9 0 5.08-1 6.8-2.62 1.8-1.62 2.7-4.12 2.7-7.12 0-.6-.05-1.18-.15-1.72z" fill="currentColor" />
    </svg>
);


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const auth = useAuth();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Le service d'authentification n'est pas disponible.",
        });
        return;
    }
    setIsLoading(true);
    
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push('/admin');
    } catch (error: any) {
      console.error("Google sign-in failed", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "La connexion avec Google a échoué. Veuillez réessayer.",
      });
    } finally {
        setIsLoading(false);
    }
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
          <div className="space-y-4">
            <Button onClick={handleGoogleLogin} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="mr-2 h-4 w-4" />
              )}
              {isLoading ? t('login.logging_in') : t('login.google_button')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
