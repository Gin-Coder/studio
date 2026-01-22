
'use client';

import { useRouter } from 'next/navigation';
import { Home, ShoppingCart, FileText, Settings, PanelLeft, ExternalLink, Shapes, ClipboardList, Warehouse, Spline, Network, Users, LogOut, Loader2, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';

type UserProfile = {
  role?: string;
};

const AdminSidebarNav = () => {
    const pathname = usePathname();
    const navLinks = [
        { href: '/admin', label: 'Tableau de bord', icon: Home },
        { href: '/admin/products', label: 'Produits', icon: ShoppingCart },
        { href: '/admin/categories', label: 'Catégories', icon: Shapes },
        { href: '/admin/subcategories', label: 'Sous-catégories', icon: Network },
        { href: '/admin/users', label: 'Utilisateurs', icon: Users },
        { href: '/admin/reviews', label: 'Avis', icon: MessageSquareQuote },
        { href: '/admin/pages', label: 'Pages', icon: FileText },
        { href: '/admin/settings', label: 'Paramètres', icon: Settings },
        { href: '/admin/orders', label: 'Gestion des commandes', icon: ClipboardList },
        { href: '/admin/stock', label: 'Gestion des stocks', icon: Warehouse },
        { href: '/admin/variants', label: 'Gestion des variantes', icon: Spline },
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
    const router = useRouter();
    const auth = useAuth();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({
                title: "Déconnexion réussie",
                description: "Vous avez été déconnecté de votre session.",
            });
            router.push('/admin/login');
        } catch (error) {
            console.error("Erreur de déconnexion: ", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de se déconnecter. Veuillez réessayer.",
            });
        }
    };
    
    const navContent = (
        <>
            <AdminSidebarNav />
            <Separator className="my-4" />
            <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Voir la boutique
                </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start mt-2" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
            </Button>
        </>
    );
    
    if (isMobile) {
        return (
            <SheetClose asChild>
                <div className='flex flex-col gap-2'>
                    {navContent}
                </div>
            </SheetClose>
        )
    }

    return navContent;
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(
        () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
        [firestore, user]
    );

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    useEffect(() => {
        if (isUserLoading) return;
        if (!user) {
            router.replace('/admin/login');
            return;
        }
        if (isProfileLoading) return;
        
        if (user && userProfile?.role !== 'admin') {
            toast({
                variant: 'destructive',
                title: 'Accès non autorisé',
                description: "Vous n'avez pas les permissions pour accéder à cette page.",
            });
            router.replace('/');
        }
    }, [user, userProfile, isUserLoading, isProfileLoading, router, toast]);

    const isLoading = isUserLoading || (user && isProfileLoading);

    if (isLoading || !user || userProfile?.role !== 'admin') {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-muted">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

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
