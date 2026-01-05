import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Separator } from '@/components/ui/separator';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">My Account</h1>
        <p className="text-muted-foreground">Manage your profile, orders, and reviews.</p>
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <AccountSidebar />
        <Separator orientation="vertical" className="hidden md: