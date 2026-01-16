
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from "@/firebase";

export default function AdminDashboard() {
  const { user } = useUser();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      <Card>
        <CardHeader>
          <CardTitle>Bienvenue, {user?.displayName || user?.email || 'Admin'}!</CardTitle>
          <CardDescription>C'est ici que vous pourrez gérer votre boutique. D'autres fonctionnalités seront bientôt ajoutées.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Utilisez la navigation sur la gauche pour gérer vos produits, pages et paramètres.</p>
        </CardContent>
      </Card>
    </div>
  )
}
