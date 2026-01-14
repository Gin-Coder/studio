
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function AdminPagesPage() {
  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <h1 className="font-headline text-2xl font-bold">Manage Pages</h1>
            <Button>
                <PlusCircle className="mr-2" />
                New Page
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Existing Pages</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Page management interface will be here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
