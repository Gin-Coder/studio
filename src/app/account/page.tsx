import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function AccountProfilePage() {
    // Mock user data
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        whatsapp: "+15551234567"
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Update your personal information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user.name} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} disabled />
                     <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number (Required)</Label>
                    <Input id="whatsapp" type="tel" defaultValue={user.whatsapp} />
                </div>
                 <div className="space-y-2">
                    <Label>Preferred Language</Label>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">Change your language across the site.</p>
                        <LanguageSwitcher />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </CardContent>
        </Card>
    );
}
