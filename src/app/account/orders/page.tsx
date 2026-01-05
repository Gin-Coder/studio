
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

// Mock data
const orders = [
    { id: 'DS-1678886400', date: '2023-03-15', status: 'Delivered', total: 119.99 },
    { id: 'DS-1679886400', date: '2023-03-27', status: 'Processing', total: 249.99 },
    { id: 'DS-1680886400', date: '2023-04-07', status: 'Shipped', total: 89.99 },
];

export default function AccountOrdersPage() {
  const { t } = useLanguage();

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'Delivered':
        return t('account.orders.status.delivered');
      case 'Processing':
        return t('account.orders.status.processing');
      case 'Shipped':
        return t('account.orders.status.shipped');
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('account.orders.title')}</CardTitle>
        <CardDescription>{t('account.orders.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('account.orders.id')}</TableHead>
              <TableHead>{t('account.orders.date')}</TableHead>
              <TableHead>{t('account.orders.status')}</TableHead>
              <TableHead className="text-right">{t('account.orders.total')}</TableHead>
              <TableHead className="text-right">{t('account.orders.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                        order.status === 'Delivered' ? 'default' 
                        : order.status === 'Shipped' ? 'secondary'
                        : 'outline'
                    }
                  >
                    {getStatusTranslation(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                    <Button variant="outline" size="sm">{t('account.orders.view_details')}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.length === 0 && (
            <div className="text-center py-16">
                <p className="text-muted-foreground">{t('account.orders.empty')}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
