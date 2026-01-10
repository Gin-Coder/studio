'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/ui/logo";
import { useFirebase } from '@/firebase';
import { handleSignInWithGoogle, getOrCreateUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { getRedirectResult } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 62.3l-66.5 64.6C305.5 102.6 279.5 88 248 88c-73.2 0-132.3 59.2-132.3 132.3s59.1 132.3 132.3 132.3c76.1 0 120.9-38.2 125-90.2h-125v-79.8h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
    </svg>
);


export default function LoginPage() {
    const { auth, user, isUserLoading } = useFirebase();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isProcessingLogin, setIsProcessingLogin] = useState(true);

    // Handle the result of a redirect sign-in, which runs when the page loads after redirect.
    useEffect(() => {
        if (!auth) return;

        // isUserLoading is true on initial load. We only want to process redirect once.
        if (isUserLoading) {
            getRedirectResult(auth)
                .then(async (result) => {
                    if (result?.user) {
                        await getOrCreateUser(result.user);
                        toast({
                            title: "Connexion réussie",
                            description: `Bienvenue, ${result.user.displayName} !`,
                        });
                        const redirectUrl = searchParams.get('redirect') || '/account';
                        router.push(redirectUrl);
                    } else {
                        // No redirect result, so we're done processing.
                        setIsProcessingLogin(false);
                    }
                })
                .catch((error) => {
                    console.error("Erreur de connexion par redirection : ", error);
                    toast({
                        variant: "destructive",
                        title: "Erreur de connexion",
                        description: "Une erreur est survenue lors de la tentative de connexion.",
                    });
                    setIsProcessingLogin(false);
                });
        } else if (!user) {
            // If auth is resolved and there's no user, we're not processing a login.
            setIsProcessingLogin(false);
        }
    }, [auth, isUserLoading, router, toast, searchParams, user]);


    // Redirect if user is already logged in and we are not in the middle of processing a redirect.
    useEffect(() => {
        if (!isProcessingLogin && user) {
            const redirectUrl = searchParams.get('redirect') || '/account';
            router.push(redirectUrl);
        }
    }, [user, isProcessingLogin, router, searchParams]);


    const onSignIn = async () => {
        if (!auth) return;
        setIsProcessingLogin(true); // Indicate that a login process has started
        try {
            await handleSignInWithGoogle(auth);
            // The user will be redirected to Google and then back to this page.
            // The useEffect hook with `getRedirectResult` will handle the rest.
        } catch (error: any) {
            console.error("Erreur de connexion: ", error);
            toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: error.message || "Une erreur inconnue est survenue.",
            });
            setIsProcessingLogin(false);
        }
    };
    
    // While checking auth state or processing a redirect, show a loading state
    if (isUserLoading || isProcessingLogin) {
        return (
             <div className="container flex min-h-[80vh] items-center justify-center py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Logo className="mx-auto mb-2" />
                        <CardTitle className="font-headline text-2xl">Welcome to Danny Store</CardTitle>
                        <CardDescription>Please wait while we check your login status...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="container flex min-h-[80vh] items-center justify-center py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Logo className="mx-auto mb-2" />
                    <CardTitle className="font-headline text-2xl">Welcome to Danny Store</CardTitle>
                    <CardDescription>Sign in to unlock a premium experience.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Button className="w-full" onClick={onSignIn} disabled={isProcessingLogin}>
                           <GoogleIcon /> Continue with Google
                        </Button>
                        <Button variant="secondary" className="w-full" disabled>
                           Continue with Facebook (Coming Soon)
                        </Button>
                        <Button variant="secondary" className="w-full" disabled>
                           Continue with Apple (Coming Soon)
                        </Button>
                    </div>
                    <Separator className="my-6" />
                     <p className="px-8 text-center text-sm text-muted-foreground">
                        By continuing, you agree to our{" "}
                        <a href="/terms-conditions" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy-policy" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
