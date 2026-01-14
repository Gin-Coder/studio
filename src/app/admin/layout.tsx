'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, FileText, Settings, Newspaper } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Skeleton } from '@/components/ui/skeleton';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/admin/login');
        }
    }, [isUserLoading, user, router]);

    const handleSignOut = async () => {
        if (auth) {
            await auth.signOut();
            router.push('/admin/login');
        }
    };

    if (isUserLoading || !user) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                     <Skeleton className="h-12 w-12 rounded-full" />
                     <Skeleton className="h-4 w-[250px]" />
                     <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar>
                    <SidebarContent>
                        <SidebarHeader>
                            <Logo />
                            <span>Danny Store CMS</span>
                        </SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton href="/admin/dashboard" isActive>
                                    <LayoutDashboard />
                                    Dashboard
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton href="#">
                                    <Newspaper />
                                    Articles
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton href="#">
                                    <FileText />
                                    Pages
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton href="#">
                                    <Settings />
                                    Configuration
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                         <SidebarFooter>
                            <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start gap-2">
                                <LogOut />
                                <span>Sign Out</span>
                            </Button>
                        </SidebarFooter>
                    </SidebarContent>
                </Sidebar>
                <main className="flex-1 p-4 md:p-8">
                     <div className="flex items-center gap-4 mb-8">
                         <SidebarTrigger className="md:hidden" />
                         <h1 className="font-headline text-2xl font-bold">Dashboard</h1>
                    </div>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayoutContent>{children}</AdminLayoutContent>
}
