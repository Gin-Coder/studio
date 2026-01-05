
'use client';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
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
