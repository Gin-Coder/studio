'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Users, AlertCircle } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, orderBy } from 'firebase/firestore';
import { useLanguage } from "@/hooks/use-language";

type UserProfile = {
    id: string;
    displayName: string | null;
    email: string | null;
    lastLogin: {
        toDate: () => Date;
    } | null;
}

export default function AdminUsersPage() {
  const firestore = useFirestore();
  const { isUserLoading } = useUser();
  const { language } = useLanguage();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return query(collection(firestore, 'users'), orderBy('lastLogin', 'desc'));
  }, [firestore, isUserLoading]);
  
  const { data: users, isLoading, error } = useCollection<UserProfile>(usersQuery);

  const isDataLoading = isLoading || isUserLoading;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Utilisateurs</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>Liste des utilisateurs ayant accès au tableau de bord.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>ID Utilisateur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isDataLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-48">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                    <TableCell colSpan={4} className="p-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Erreur de Permissions</AlertTitle>
                            <AlertDescription>
                                Impossible de charger la liste des utilisateurs. Les règles de sécurité de Firestore ont refusé l'accès.
                                <pre className="mt-2 whitespace-pre-wrap rounded-md bg-destructive/20 p-2 font-mono text-xs">
                                    {error.message}
                                </pre>
                            </AlertDescription>
                        </Alert>
                    </TableCell>
                </TableRow>
              ) : !users || users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-48">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Aucun utilisateur trouvé.</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                    <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.displayName || "N/A"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.lastLogin ? user.lastLogin.toDate().toLocaleString(language) : 'Jamais'}</TableCell>
                    <TableCell><Badge variant="outline">{user.id}</Badge></TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
