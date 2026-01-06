
import type { Metadata } from 'next';
import './globals.css';
import { ClientLayout } from './client-layout';


// Metadata is defined in the Server Component part of the file.
export const metadata: Metadata = {
  title: 'Danny Store',
  description: 'Premium lifestyle e-commerce for Haiti and the world.',
  openGraph: {
    title: 'Danny Store',
    description: 'Premium lifestyle e-commerce for Haiti and the world.',
    url: 'https://dannystore.com', // Replace with actual domain
    siteName: 'Danny Store',
    images: [
      {
        url: '/logo-og.png', // Ensure this image exists in /public
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Danny Store',
    description: 'Premium lifestyle e-commerce for Haiti and the world.',
    images: ['/logo-og.png'], // Ensure this image exists in /public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is a server component, so we wrap the app in ClientLayout
  // which will provide all the client-side context.
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}

