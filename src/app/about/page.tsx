
'use client';
import Image from "next/image";
import { useLanguage } from "@/hooks/use-language";

export default function AboutPage() {
    const { t } = useLanguage();
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-6xl">
            {t('about.title')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="my-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative aspect-square">
            <Image
              src="https://picsum.photos/seed/about1/800/800"
              alt="Stylish clothing display"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
              data-ai-hint="fashion boutique"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-headline text-3xl font-bold">{t('about.mission.title')}</h2>
            <p className="mt-4 text-muted-foreground">
              {t('about.mission.p1')}
            </p>
            <p className="mt-4 text-muted-foreground">
              {t('about.mission.p2')}
            </p>
          </div>
        </div>

        <div className="my-16 grid grid-cols-1 gap-8 md:grid-cols-2">
           <div className="flex flex-col justify-center md:order-2">
            <h2 className="font-headline text-3xl font-bold">{t('about.future.title')}</h2>
            <p className="mt-4 text-muted-foreground">
              {t('about.future.p1')}
            </p>
            <p className="mt-4 text-muted-foreground">
             {t('about.future.p2')}
            </p>
          </div>
          <div className="relative aspect-square md:order-1">
            <Image
              src="https://picsum.photos/seed/about2/800/800"
              alt="Person using a phone for shopping"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
              data-ai-hint="virtual try on"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
