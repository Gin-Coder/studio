
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/hooks/use-language";

export default function AccountProfilePage() {
    const { t } = useLanguage();
    // Mock user data
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        whatsapp: "+15551234567"
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('account.profile.title')}</CardTitle>
                <CardDescription>{t('account.profile.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">{t('account.profile.name')}</Label>
                    <Input id="name" defaultValue={user.name} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">{t('account.profile.email')}</Label>
                    <Input id="email" type="email" defaultValue={user.email} disabled />
                     <p className="text-xs text-muted-foreground">{t('account.profile.email_desc')}</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="whatsapp">{t('account.profile.whatsapp')}</Label>
                    <Input id="whatsapp" type="tel" defaultValue={user.whatsapp} />
                </div>
                 <div className="space-y-2">
                    <Label>{t('account.profile.language')}</Label>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">{t('account.profile.language_desc')}</p>
                        <LanguageSwitcher />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button>{t('account.profile.save')}</Button>
                </div>
            </CardContent>
        </Card>
    );
}
