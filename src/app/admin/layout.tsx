'use client';

import { useRouter } from 'next/navigation';
import { Home, ShoppingCart, FileText, Settings, LogOut, PanelLeft, ExternalLink, Shapes, ClipboardList, Warehouse } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const AdminSidebarNav = () => {
    const pathname = usePathname();
    const navLinks = [
        { href: '/admin', label: 'Tableau de bord', icon: Home },
        { href: '/admin/products', label: 'Produits', icon: ShoppingCart },
        { href: '/admin/categories', label: 'Catégories', icon: Shapes },
        { href: '/admin/pages', label: 'Pages', icon: FileText },
        { href: '/admin/settings', label: 'Paramètres', icon: Settings },
        { href: '/admin/orders', label: 'Gestion des commandes', icon: ClipboardList },
        { href: '/admin/stock', label: 'Gestion des stocks', icon: Warehouse },
    ];

    return (
        <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        pathname.startsWith(link.href) && (link.href !== '/admin' || pathname === '/admin') ? 'bg-muted text-primary' : ''
                    )}
                >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                </Link>
            ))}
        </nav>
    );
};

const SidebarItems = ({ isMobile = false }: { isMobile?: boolean }) => {
    const viewStoreButton = (
        <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir la boutique
            </Link>
        </Button>
    );

    const content = (
        <>
            <AdminSidebarNav />
            <Separator className="my-4" />
            {viewStoreButton}
        </>
    );
    
    if (isMobile) {
        return (
            <SheetClose asChild>
                <div className='flex flex-col gap-2'>
                    <AdminSidebarNav />
                    <Separator className="my-4" />
                    {viewStoreButton}
                </div>
            </SheetClose>
        )
    }

    return content;
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = () => {
        // When auth is re-enabled: await auth.signOut();
        router.push('/login');
    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/admin" className="flex items-center gap-2 font-semibold">
                            <Logo />
                            <span className="">Danny Store</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <div className="grid items-start p-2 text-sm font-medium lg:p-4">
                            <SidebarItems />
                        </div>
                    </div>
                    <div className="mt-auto border-t p-4">
                        <Button size="sm" variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0"
                            >
                                <PanelLeft className="h-5 w-5" />
                                <span className="sr-only">Ouvrir le menu de navigation</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col p-0">
                            <div className="flex h-14 items-center border-b px-4">
                               <SheetClose asChild>
                                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                                     <Logo />
                                     <span>Danny Store</span>
                                </Link>
                                </SheetClose>
                            </div>
                            <div className="flex-1 overflow-auto p-2">
                                <SidebarItems isMobile />
                            </div>
                             <div className="mt-auto p-4 border-t">
                                <Button size="sm" variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Déconnexion
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                     <div className="flex-1 text-center font-semibold">Tableau de bord</div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
                    {children}
                </main>
            </div>
        </div>
    );
}
