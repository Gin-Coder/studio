import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-6xl">
            About Danny Store
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Redefining style with a touch of premium elegance, accessible to everyone, everywhere.
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
            <h2 className="font-headline text-3xl font-bold">Our Mission</h2>
            <p className="mt-4 text-muted-foreground">
              At Danny Store, our mission is to bring world-class fashion and lifestyle products to Haiti and the global community. We believe in the power of style as a form of self-expression. We meticulously curate our collections to ensure they represent the pinnacle of quality, craftsmanship, and modern design.
            </p>
            <p className="mt-4 text-muted-foreground">
              We are more than just a marketplace; we are a destination for inspiration, a community for style enthusiasts, and a platform that bridges local talent with global trends.
            </p>
          </div>
        </div>

        <div className="my-16 grid grid-cols-1 gap-8 md:grid-cols-2">
           <div className="flex flex-col justify-center md:order-2">
            <h2 className="font-headline text-3xl font-bold">The Future of Shopping</h2>
            <p className="mt-4 text-muted-foreground">
              Innovation is at the heart of the Danny Store experience. We are pioneering a new way to shop online with our Virtual Try-On technology, allowing you to visualize your look with confidence before making a purchase. Our seamless WhatsApp checkout process provides a personal, concierge-like service that is both modern and convenient.
            </p>
            <p className="mt-4 text-muted-foreground">
              We are committed to creating a shopping experience that is not only transactional but also transformational, empowering you to discover and define your unique style.
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