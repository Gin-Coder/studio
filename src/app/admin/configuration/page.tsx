
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminConfigurationPage() {
  return (
    <div className="space-y-8">
        <h1 className="font-headline text-2xl font-bold">Site Configuration</h1>
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Configuration options for the site will be here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
