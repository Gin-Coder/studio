'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Product, Avatar } from '@/lib/types';
import { avatars } from '@/lib/mock-data';

interface VirtualTryOnProps {
  product: Product;
}

export default function VirtualTryOn({ product }: VirtualTryOnProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

  return (
    <div className="mt-16">
      <h2 className="mb-8 text-center font-headline text-3xl font-bold">Virtual Try-On</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Avatar Selection */}
        <div>
          <h3 className="mb-4 font-semibold">Choose Your Avatar</h3>
          <RadioGroup onValueChange={(value) => setSelectedAvatar(avatars.find(a => a.id === value) || null)} className="grid grid-cols-2 gap-4">
            {avatars.map(avatar => (
              <div key={avatar.id} className="space-y-2">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-4">
                    <Image
                      src={avatar.imageUrl}
                      alt={avatar.description}
                      width={100}
                      height={100}
                      className="rounded-full object-cover"
                      data-ai-hint={avatar.imageHint}
                    />
                  </CardContent>
                </Card>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={avatar.id} id={`avatar-${avatar.id}`} className="peer sr-only" />
                  <label
                    htmlFor={`avatar-${avatar.id}`}
                    className="text-sm font-medium leading-none peer-data-[state=checked]:text-sky-500"
                  >
                    {avatar.description}
                  </label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Try-On Result */}
        <div>
          <h3 className="mb-4 font-semibold">Your Virtual Look</h3>
          <Card>
            <CardContent className="relative aspect-[3/4] flex items-center justify-center p-4">
              {selectedAvatar ? (
                <Image
                  src={selectedAvatar.imageUrl}
                  alt={selectedAvatar.description}
                  fill
                  className="object-contain"
                  data-ai-hint={selectedAvatar.imageHint}
                />
              ) : (
                <p className="text-muted-foreground">Select an avatar to see yourself wearing this item.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
