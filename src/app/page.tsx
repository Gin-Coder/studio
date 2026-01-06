
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Truck, ShieldCheck, Gem } from 'lucide-react';
import { products, categories, reviews } from '@/lib/mock-data';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from '@/components/ui/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';


export default function Home() {
    const { t } = useLanguage();
    const plugin = useRef(
      Autoplay({ delay: 4000, stopOnInteraction: true })
    );

  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-main') || { src: '', alt: '', hint: '' };

  const bestSellers = products.slice(0, 8);
  const newArrivals = products.slice(8, 16);

  return (
    <div className="bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] md:min-h-screen text-white">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full min-h-[85vh] w-full flex-col items-center justify-center text-center p-4 sm:p-6 lg:p-8 md:min-h-screen">
          <Logo className="mb-4 !h-24 !w-24" />
          <h1 className="font-headline text-3xl font-bold sm:text-5xl md:text-6xl">
            {t('home.hero.title')}
          </h1>
          <p className="mt-4 max-w-xl text-base sm:text-lg md:text-xl">
            {t('home.hero.subtitle')}
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/shop">
              {t('home.hero.button')} <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-secondary py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl">
            {t('home.categories.title')}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-8">
            {categories.map((category) => (
              <Link href={`/shop?category=${category.id}`} key={category.id} className="group">
                <Card className="overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                  <CardContent className="relative aspect-square p-0">
                    <Image
                      src={category.imageUrl}
                      alt={t(`filter.${category.id}`)}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={category.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <h3 className="absolute bottom-4 left-4 font-headline text-xl font-semibold text-white md:text-2xl">
                      {t(`filter.${category.id}`)}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="bg-background py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl">
            {t('home.bestsellers.title')}
          </h2>
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {bestSellers.map((product) => (
                <CarouselItem key={product.id} className="basis-1/1 sm:basis-1/2 lg:basis-1/4">
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-14" />
            <CarouselNext className="mr-14" />
          </Carousel>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl">
            {t('home.newarrivals.title')}
          </h2>
           <Carousel
             plugins={[plugin.current]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {newArrivals.map((product) => (
                <CarouselItem key={product.id} className="basis-1/1 sm:basis-1/2 lg:basis-1/4">
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-14" />
            <CarouselNext className="mr-14" />
          </Carousel>
        </div>
      </section>

      {/* Why Danny Store Section */}
      <section className="bg-secondary py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl">
            {t('home.why_us.title')}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground">
                <Gem size={32} />
              </div>
              <h3 className="mb-2 font-headline text-xl font-semibold">
                {t('home.why_us.quality.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('home.why_us.quality.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground">
                <Truck size={32} />
              </div>
              <h3 className="mb-2 font-headline text-xl font-semibold">
                {t('home.why_us.concierge.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('home.why_us.concierge.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground">
                <ShieldCheck size={32} />
              </div>
              <h3 className="mb-2 font-headline text-xl font-semibold">
                {t('home.why_us.try_on.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('home.why_us.try_on.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl">
            {t('home.reviews.title')}
          </h2>
          <Carousel
             plugins={[plugin.current]}
            opts={{ align: 'start', loop: true }}
            className="w-full max-w-4xl mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="md:basis-1/2">
                  <div className="p-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-2">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating
                                    ? 'fill-accent text-accent'
                                    : 'fill-muted text-muted-foreground'
                                }`}
                              />
                            ))}
                        </div>
                        <p className="mb-4 italic text-muted-foreground">
                          "{review.text}"
                        </p>
                        <div className="flex items-center">
                          <Image
                            src={review.avatarUrl}
                            alt={review.author}
                            width={40}
                            height={40}
                            className="rounded-full"
                            data-ai-hint="person portrait"
                          />
                          <p className="ml-4 font-semibold">{review.author}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
