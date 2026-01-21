
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleAccessAdmin = () => {
    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <Link href="/" className="mb-4 inline-block">
                <Logo className="mx-auto" />
            </Link>
          <CardTitle className="text-2xl font-bold">Panneau d'Administration</CardTitle>
          <CardDescription>L'authentification est temporairement désactivée pour le développement.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={handleAccessAdmin} className="w-full">
              Accéder au tableau de bord
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
