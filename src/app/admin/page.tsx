
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useFirestore, useUser } from "@/firebase";
import { seedDatabase } from '@/lib/seed';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase(firestore);
      toast({
        title: "Base de données initialisée",
        description: "Les données de démonstration ont été chargées avec succès.",
      });
    } catch (error) {
      console.error("Failed to seed database:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'initialisation",
        description: "Impossible de charger les données de démonstration.",
      });
    } finally {
      setIsSeeding(false);
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenue, {user?.displayName || user?.email || 'Admin'}!</CardTitle>
            <CardDescription>C'est ici que vous pourrez gérer votre boutique. D'autres fonctionnalités seront bientôt ajoutées.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Utilisez la navigation sur la gauche pour gérer vos produits, pages et paramètres.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Initialisation des données</CardTitle>
            <CardDescription>
              Si votre boutique est vide, vous pouvez la remplir avec des produits et catégories de démonstration pour commencer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSeed} disabled={isSeeding}>
              {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSeeding ? "Chargement..." : "Charger les données de démo"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
