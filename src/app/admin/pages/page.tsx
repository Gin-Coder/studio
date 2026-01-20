'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function AdminPagesPage() {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Pages</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gestionnaire de Contenu</CardTitle>
          <CardDescription>Cette section est en cours de développement.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center p-16">
          <FileText className="h-24 w-24 text-muted-foreground" />
          <h2 className="mt-8 font-headline text-2xl font-bold">Bientôt disponible</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Vous pourrez bientôt gérer ici le contenu de vos pages statiques, comme les pages "À propos" ou "Contact", directement depuis cette interface d'administration.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
