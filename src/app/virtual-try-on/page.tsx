
'use client';

import { useState, useEffect, useMemo, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { products, avatars } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Upload, Trash2, Heart, Layers, Shirt } from 'lucide-react';
import type { Product, Avatar } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-language';
import { virtualTryOn } from '@/ai/flows/virtual-try-on-flow';


const MAX_FREE_USES = 5;

export default function VirtualTryOnPage() {
  const { cartItems } = useCart();
  const { t } = useLanguage();
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(avatars[0]);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tryOnCount, setTryOnCount] = useState(0);

  useEffect(() => {
    const storedCount = localStorage.getItem('tryOnCount');
    const lastResetDate = localStorage.getItem('tryOnLastReset');
    const today = new Date().toDateString();

    if (lastResetDate !== today) {
        localStorage.setItem('tryOnCount', '0');
        localStorage.setItem('tryOnLastReset', today);
        setTryOnCount(0);
    } else if (storedCount) {
        setTryOnCount(parseInt(storedCount, 10));
    }
  }, []);
  

  const cartProducts = useMemo(() => {
    return cartItems
      .map(cartItem => products.find(p => p.id === cartItem.productId))
      .filter((p): p is Product => p !== undefined);
  }, [cartItems]);

  const { topItems, shoeItems } = useMemo(() => {
    const tops = selectedItems.filter(item => item.category === 'clothing');
    const shoes = selectedItems.filter(item => item.category === 'shoes');
    return { topItems: tops, shoeItems: shoes };
  }, [selectedItems]);

  useEffect(() => {
    // Pre-select all clothing and shoe items from the cart by default
    setSelectedItems(cartProducts.filter(p => ['clothing', 'shoes'].includes(p.category)));
  }, [cartProducts]);

  const handleItemToggle = (product: Product, checked: boolean) => {
    setSelectedItems((prev) =>
      checked
        ? [...prev, product]
        : prev.filter((item) => item.id !== product.id)
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setSelectedAvatar(null); // Deselect avatar when user uploads an image
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerate = async () => {
    if (tryOnCount >= MAX_FREE_USES) {
        toast({
            variant: 'destructive',
            title: "Limite d'essais atteinte",
            description: "Vous avez utilisé vos 5 essais gratuits pour aujourd'hui. Revenez demain !",
        });
        return;
    }

    const modelImageUri = userImage || selectedAvatar?.imageUrl;

    if (selectedItems.length === 0) {
      toast({
        variant: 'destructive',
        title: t('vto.toast.no_items.title'),
        description: t('vto.toast.no_items.description'),
      });
      return;
    }
    if (!modelImageUri) {
        toast({
            variant: 'destructive',
            title: t('vto.toast.no_model.title'),
            description: t('vto.toast.no_model.description'),
        });
        return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
        const itemImageUris = selectedItems.map(item => item.images[0]);
        const result = await virtualTryOn({ modelImageUri, itemImageUris });
        setGeneratedImage(result.imageUrl);
        
        const newCount = tryOnCount + 1;
        setTryOnCount(newCount);
        localStorage.setItem('tryOnCount', newCount.toString());
        toast({
            title: t('vto.toast.generated.title'),
            description: `${t('vto.toast.generated.description')} (${MAX_FREE_USES - newCount} essais restants)`,
        });

    } catch (error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Erreur de Génération',
            description: error.message || 'Une erreur est survenue lors de la génération de l\'image.',
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSaveOutfit = () => {
      if (!generatedImage || selectedItems.length === 0) {
          toast({ variant: 'destructive', title: t('vto.toast.empty_outfit.title') });
          return;
      }
      // Logic to save the outfit
      toast({ title: t('vto.toast.saved.title'), description: t('vto.toast.saved.description') });
  }

  const remainingTries = MAX_FREE_USES - tryOnCount;

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">{t('vto.title')}</h1>
        <p className="text-muted-foreground">{t('vto.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Item & Avatar Selection */}
        <div className="lg:col-span-1 space-y-8">
          {/* Item Selection */}
          <Card>
            <CardHeader>
              <CardTitle>{t('vto.select_items.title')}</CardTitle>
              <CardDescription>{t('vto.select_items.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {cartProducts.length > 0 ? cartProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`item-${product.id}`}
                        checked={selectedItems.some(item => item.id === product.id)}
                        onCheckedChange={(checked) => handleItemToggle(product, !!checked)}
                        disabled={!['clothing', 'shoes'].includes(product.category)}
                      />
                      <label
                        htmlFor={`item-${product.id}`}
                        className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                      >
                          <Image src={product.images[0]} alt={product.name} width={40} height={40} className="rounded-md object-cover"/>
                          <span className="truncate">{product.name}</span>
                           {!['clothing', 'shoes'].includes(product.category) && <Badge variant="outline">{t('vto.not_tryable')}</Badge>}
                      </label>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground text-center py-10">{t('vto.select_items.empty')}</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Avatar/Model Selection */}
          <Card>
            <CardHeader>
              <CardTitle>{t('vto.choose_model.title')}</CardTitle>
              <CardDescription>{t('vto.choose_model.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                 {userImage && (
                    <div className="mb-4 text-center">
                        <div className="relative w-32 h-32 mx-auto rounded-full border-2 border-primary overflow-hidden">
                            <Image src={userImage} alt="Your photo" layout="fill" objectFit="cover" />
                        </div>
                        <Button variant="link" size="sm" onClick={() => setUserImage(null)}>Changer de photo</Button>
                    </div>
                )}

                <RadioGroup 
                    onValueChange={(value) => {
                        if (value === 'upload') {
                            fileInputRef.current?.click();
                        } else {
                            setSelectedAvatar(avatars.find(a => a.id === value) || null);
                            setUserImage(null);
                        }
                    }}
                    value={userImage ? 'upload' : selectedAvatar?.id || ''}
                    className="grid grid-cols-2 gap-4 mb-4"
                >
                    {avatars.map(avatar => (
                        <Label key={avatar.id} htmlFor={`avatar-${avatar.id}`} className="cursor-pointer">
                            <Card className="has-[:checked]:ring-2 has-[:checked]:ring-primary">
                                <CardContent className="p-2">
                                     <Image
                                        src={avatar.imageUrl}
                                        alt={avatar.description}
                                        width={150}
                                        height={150}
                                        className="rounded-md object-cover aspect-[3/4]"
                                    />
                                </CardContent>
                            </Card>
                            <div className="flex items-center mt-2 space-x-2">
                                <RadioGroupItem value={avatar.id} id={`avatar-${avatar.id}`} />
                                <span className="text-sm">{avatar.description}</span>
                            </div>
                        </Label>
                    ))}
                </RadioGroup>
                <Separator className="my-4"/>
                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> {t('vto.choose_model.upload')}
                </Button>
                <input ref={fileInputRef} type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                 <p className="text-xs text-muted-foreground mt-2 text-center">
                    {t('vto.choose_model.disclaimer')} ({remainingTries} restants)
                 </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Preview & Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('vto.your_look.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Preview Area */}
                    <div className="md:col-span-2 relative aspect-[3/4] rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                        {isGenerating && (
                            <div className="flex flex-col items-center gap-2">
                                <Sparkles className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-muted-foreground">{t('vto.generating')}</p>
                            </div>
                        )}
                        {!isGenerating && !generatedImage && (
                            <div className="text-center p-4">
                                <Shirt className="h-16 w-16 mx-auto text-muted-foreground"/>
                                <p className="text-muted-foreground mt-4">{t('vto.your_look.placeholder')}</p>
                            </div>
                        )}
                         {generatedImage && (
                             <Image
                                src={generatedImage}
                                alt={t('vto.your_look.alt')}
                                fill
                                className="object-contain rounded-lg"
                            />
                        )}
                    </div>

                    {/* Actions & Selected Items */}
                    <div className="md:col-span-1 space-y-6">
                       <Button size="lg" className="w-full" onClick={handleGenerate} disabled={isGenerating || remainingTries <= 0}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            {isGenerating ? t('vto.generating_button') : t('vto.generate_button')}
                       </Button>
                       <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><Layers className="h-4 w-4"/>{t('vto.selected_items.title')}</h3>
                            <div className="space-y-3">
                                {selectedItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-secondary">
                                        <span className="truncate pr-2">{item.name}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleItemToggle(item, false)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground"/>
                                        </Button>
                                    </div>
                                ))}
                                {selectedItems.length === 0 && <p className="text-sm text-muted-foreground">{t('vto.selected_items.empty')}</p>}
                            </div>
                       </div>
                        <Separator />
                        <Button variant="outline" className="w-full" onClick={handleSaveOutfit} disabled={!generatedImage || isGenerating}>
                            <Heart className="mr-2 h-4 w-4" /> {t('vto.save_outfit_button')}
                       </Button>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
