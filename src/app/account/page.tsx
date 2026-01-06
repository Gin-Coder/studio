
'use client';
import { useEffect, useState } from 'react';
import { doc, DocumentData } from 'firebase/firestore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/hooks/use-language";
import { useFirebase, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';


const profileFormSchema = z.object({
  phoneWhatsApp: z.string().min(1, 'WhatsApp number is required'),
  consentWhatsApp: z.boolean().refine(val => val === true, {
    message: 'You must consent to WhatsApp communication',
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;


export default function AccountProfilePage() {
    const { t } = useLanguage();
    const { user, firestore, isUserLoading: isAuthLoading } = useFirebase();
    const { toast } = useToast();

    const userRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    const { data: userData, isLoading: isDocLoading } = useDoc<DocumentData>(userRef);
    
    const isLoading = isAuthLoading || (user && isDocLoading);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            phoneWhatsApp: '',
            consentWhatsApp: false,
        }
    });

    useEffect(() => {
        if (userData) {
            reset({
                phoneWhatsApp: userData.phoneWhatsApp || '',
                consentWhatsApp: userData.consentWhatsApp || false,
            });
        }
    }, [userData, reset]);

    const onSubmit = (data: ProfileFormValues) => {
        if (!userRef) return;
        // Use { merge: true } to only update the fields in the form
        setDocumentNonBlocking(userRef, data, { merge: true });
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
    };

    const showOnboardingAlert = !isLoading && userData && (!userData.phoneWhatsApp || !userData.consentWhatsApp);

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2 rounded-lg" />
                    <Skeleton className="h-4 w-3/4 mt-2 rounded-lg" />
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                    <div className="flex items-start space-x-3 rounded-md border p-4">
                        <Skeleton className="h-6 w-6 rounded" />
                        <div className="space-y-2 flex-1">
                             <Skeleton className="h-4 w-1/2 rounded-lg" />
                             <Skeleton className="h-3 w-full rounded-lg" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    if (!user) {
        return null; // The layout will handle the redirect
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>{t('account.profile.title')}</CardTitle>
                    <CardDescription>{t('account.profile.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {showOnboardingAlert && (
                         <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Action Required</AlertTitle>
                            <AlertDescription>
                                Please provide your WhatsApp number and consent to continue. This is required for order processing.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="displayName">{t('account.profile.name')}</Label>
                        <Input id="displayName" value={userData?.displayName || ''} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('account.profile.email')}</Label>
                        <Input id="email" type="email" value={user?.email || ''} disabled />
                        <p className="text-xs text-muted-foreground">{t('account.profile.email_desc')}</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phoneWhatsApp">{t('account.profile.whatsapp')}</Label>
                        <Controller
                            name="phoneWhatsApp"
                            control={control}
                            render={({ field }) => <Input id="phoneWhatsApp" type="tel" {...field} />}
                        />
                        {errors.phoneWhatsApp && <p className="text-sm text-destructive">{errors.phoneWhatsApp.message}</p>}
                    </div>

                    <div className="flex items-start space-x-3 rounded-md border p-4">
                         <Controller
                            name="consentWhatsApp"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id="consentWhatsApp"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                             )}
                        />
                        <div className="space-y-1 leading-none">
                            <Label htmlFor="consentWhatsApp" className="cursor-pointer">
                                Consent to WhatsApp Communication
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                You agree to be contacted via WhatsApp for order confirmations and delivery coordination.
                            </p>
                             {errors.consentWhatsApp && <p className="text-sm text-destructive">{errors.consentWhatsApp.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t('account.profile.language')}</Label>
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-muted-foreground">{t('account.profile.language_desc')}</p>
                            <LanguageSwitcher />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>{t('account.profile.save')}</Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
