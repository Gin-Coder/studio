
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Truck, ShieldCheck, Gem, Loader2, Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from '@/components/ui/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Product, Category, Review } from '@/lib/types';
import { collection, limit, query, where, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const HomeSkeleton = () => (
  <>
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl"><Skeleton className="h-10 w-64 mx-auto" /></h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)}
        </div>
      </div>
    </section>
    <section className="bg-background py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl">
            <Skeleton className="h-10 w-64 mx-auto" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[400px] w-full" />)}
          </div>
        </div>
    </section>
  </>
)


export default function Home() {
    const { t } = useLanguage();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const autoplay = useRef(
      Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    const continuousAutoplay = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
    )

  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-main') || { src: '', alt: '', hint: '' };

  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'categories') : null), [firestore]);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);
  
  const publishedProductsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products'), where('status', '==', 'published'), limit(8)) : null),
    [firestore]
  );
  const { data: bestSellers, isLoading: isLoadingBestSellers } = useCollection<Product>(publishedProductsQuery);
  const { data: newArrivals, isLoading: isLoadingNewArrivals } = useCollection<Product>(publishedProductsQuery);

  const reviewsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'reviews'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'), limit(5)) : null),
    [firestore]
  );
  const { data: reviews, isLoading: isLoadingReviews } = useCollection<Review>(reviewsQuery);


  const categoryMap = useMemo(() => {
    if (!categories) return new Map<string, string>();
    return new Map(categories.map(cat => [cat.id, cat.nameKey]));
  }, [categories]);
  
  const isLoading = isLoadingCategories || isLoadingBestSellers || isLoadingNewArrivals || isLoadingReviews;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/shop');
    }
  };

  const getCategoryDisplayName = (category: Category) => {
    return t(category.nameKey);
  };

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
          <form onSubmit={handleSearch} className="mt-8 w-full max-w-xl">
              <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                      type="search"
                      placeholder={t('nav.search_placeholder')}
                      className="h-14 w-full rounded-full pl-12 pr-32 text-base text-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="lg" className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full px-6">
                      {t('nav.search_button')}
                  </Button>
              </div>
          </form>
        </div>
      </section>

      {isLoading && <HomeSkeleton />}

      {/* Categories Section */}
      {!isLoading && categories && (
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
              <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl">
                {t('home.categories.title')}
              </h2>
          </div>
          <div className="w-full">
            <Carousel
              plugins={[autoplay.current, Fade()]}
              opts={{ align: 'start', loop: true }}
              className="w-full"
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}
            >
              <CarouselContent className="-ml-0">
                {categories.map((category) => (
                  <CarouselItem key={category.id} className="pl-0 basis-full">
                    <Link href={`/shop?category=${category.id}`} className="group block outline-none">
                      <div className="relative w-full h-[60vh] md:h-[75vh]">
                        <Image
                          src={category.imageUrl}
                          alt={getCategoryDisplayName(category)}
                          fill
                          sizes="100vw"
                          className="object-cover"
                          data-ai-hint={category.imageHint}
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-4 transition-colors duration-300 group-hover:bg-black/50">
                          <h3 className="font-headline text-4xl font-bold drop-shadow-md md:text-6xl lg:text-7xl transition-transform duration-300 group-hover:scale-105">
                            {getCategoryDisplayName(category)}
                          </h3>
                          <div className="mt-4 flex items-center text-lg font-semibold text-white opacity-0 transition-all duration-300 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0">
                            <span>{t('shop.title')}</span>
                            <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/20 hover:bg-black/40 border-white/40 hover:border-white" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/20 hover:bg-black/40 border-white/40 hover:border-white" />
            </Carousel>
          </div>
        </section>
      )}


      {/* Best Sellers Section */}
      {!isLoading && bestSellers && (
        <section className="bg-background py-12 md:py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl">
              {t('home.bestsellers.title')}
            </h2>
            <Carousel
              plugins={[autoplay.current]}
              opts={{ align: 'center', loop: true }}
              className="w-full"
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}
            >
              <CarouselContent>
                {bestSellers.map((product) => (
                  <CarouselItem key={product.id} className="basis-1/1 sm:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <ProductCard product={product} categoryMap={categoryMap} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-14" />
              <CarouselNext className="mr-14" />
            </Carousel>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {!isLoading && newArrivals && (
        <section className="py-12 md:py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl">
              {t('home.newarrivals.title')}
            </h2>
             <Carousel
               plugins={[autoplay.current]}
              opts={{ align: 'center', loop: true }}
              className="w-full"
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}
            >
              <CarouselContent>
                {newArrivals.map((product) => (
                  <CarouselItem key={product.id} className="basis-1/1 sm:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <ProductCard product={product} categoryMap={categoryMap} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-14" />
              <CarouselNext className="mr-14" />
            </Carousel>
          </div>
        </section>
      )}
      

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
      {!isLoading && reviews && reviews.length > 0 && (
        <section className="py-12 md:py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center font-headline text-3xl font-bold md:mb-12 md:text-4xl">
              {t('home.reviews.title')}
            </h2>
            <Carousel
              plugins={[continuousAutoplay.current]}
              opts={{ align: 'start', loop: true }}
              className="w-full max-w-4xl mx-auto"
            >
              <CarouselContent className="-ml-1">
                {reviews.map((review) => (
                  <CarouselItem key={review.id} className="pl-1 md:basis-1/2">
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
                          <p className="font-semibold">{review.title}</p>
                          <p className="mb-4 italic text-muted-foreground">
                            "{review.comment}"
                          </p>
                          <div className="flex items-center">
                            <Image
                              src={review.userAvatarUrl || '/default-avatar.png'}
                              alt={review.userName}
                              width={40}
                              height={40}
                              className="rounded-full bg-muted"
                              data-ai-hint="person portrait"
                            />
                            <p className="ml-4 font-semibold">{review.userName}</p>
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
      )}
    </div>
  );
}
