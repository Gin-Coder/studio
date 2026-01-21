
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError, useUser } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import type { StoreSettings, Currency, Language } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const SettingsSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-7 w-1/3" />
      <Skeleton className="h-4 w-2/3 mt-2" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
      <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
        <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-24" />
    </CardFooter>
  </Card>
)

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { isUserLoading } = useUser();
  
  const settingsRef = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return doc(firestore, 'settings', 'storeConfig');
  }, [firestore, isUserLoading]);

  const { data: settings, isLoading } = useDoc<StoreSettings>(settingsRef);
  
  const [storeName, setStoreName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState<Currency>('USD');
  const [defaultLanguage, setDefaultLanguage] = useState<Language>('fr');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setStoreName(settings.storeName || 'Danny Store');
      setContactEmail(settings.contactEmail || 'gincoder-ms@outlook.fr');
      setDefaultCurrency(settings.defaultCurrency || 'USD');
      setDefaultLanguage(settings.defaultLanguage || 'fr');
    }
  }, [settings]);

  const handleSave = () => {
    if (!firestore || !settingsRef) return;
    setIsSaving(true);
    
    const settingsData: StoreSettings = {
      storeName,
      contactEmail,
      defaultCurrency,
      defaultLanguage,
    };

    setDoc(settingsRef, settingsData, { merge: true })
      .then(() => {
        toast({ title: 'Paramètres sauvegardés', description: 'Vos modifications ont été enregistrées avec succès.' });
      })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: settingsRef.path,
            operation: 'update',
            requestResourceData: settingsData,
        }));
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const isDataLoading = isLoading || isUserLoading;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Paramètres</h1>
      </div>
      {isDataLoading ? <SettingsSkeleton /> : (
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de la boutique</CardTitle>
            <CardDescription>Gérez les informations générales et les paramètres par défaut de votre boutique.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="storeName">Nom de la boutique</Label>
              <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Email de contact</Label>
              <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                <Select value={defaultCurrency} onValueChange={(value: Currency) => setDefaultCurrency(value)}>
                  <SelectTrigger id="defaultCurrency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="HTG">HTG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                <Select value={defaultLanguage} onValueChange={(value: Language) => setDefaultLanguage(value)}>
                  <SelectTrigger id="defaultLanguage"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ht">Kreyòl</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sauvegarder les changements
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
