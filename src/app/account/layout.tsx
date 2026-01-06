'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';
import { useUser } from '@/firebase'; // Changed to useUser for clarity
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If auth state is resolved and there's no user, redirect to login
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // While loading or if no user (and redirect is in progress), show a loading state
  if (isUserLoading || !user) {
    return (
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <Skeleton className="h-10 w-1/2 rounded-lg" />
                <Skeleton className="h-4 w-3/4 mt-2 rounded-lg" />
            </div>
            <div className="flex flex-col gap-8 md:flex-row">
                <div className="w-full md:w-64 md:pr-8">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                </div>
                <Separator orientation="vertical" className="hidden md:block" />
                <div className="flex-1">
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{t('account.layout.title')}</h1>
        <p className="text-muted-foreground">{t('account.layout.description')}</p>
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <AccountSidebar />
        <Separator orientation="vertical" className="hidden md:block" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
