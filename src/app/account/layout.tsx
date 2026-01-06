
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';
import { useFirebase } from '@/firebase';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="container flex min-h-[80vh] items-center justify-center py-12">
            <p>Loading...</p>
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
