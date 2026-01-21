'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from 'firebase/firestore';

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

  const usersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'users'), orderBy('lastLogin', 'desc')) : null, [firestore]);
  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

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
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-48">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && (!users || users.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-48">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Aucun utilisateur trouvé.</p>
                  </TableCell>
                </TableRow>
              )}
              {users?.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.displayName || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.lastLogin ? user.lastLogin.toDate().toLocaleString() : 'Jamais'}</TableCell>
                  <TableCell><Badge variant="outline">{user.id}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
