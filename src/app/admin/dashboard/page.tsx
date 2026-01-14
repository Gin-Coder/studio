
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
        <h1 className="font-headline text-2xl font-bold">Dashboard</h1>
        <Card>
            <CardHeader>
                <CardTitle>Welcome, Admin!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This is your CMS dashboard. From here, you can manage all the content of your website.</p>
                <p className="mt-4 text-sm text-muted-foreground">Select an option from the sidebar to get started.</p>
            </CardContent>
        </Card>
    </div>
  );
}
