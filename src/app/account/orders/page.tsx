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

// Mock data
const orders = [
    { id: 'DS-1678886400', date: '2023-03-15', status: 'Delivered', total: 119.99 },
    { id: 'DS-1679886400', date: '2023-03-27', status: 'Processing', total: 249.99 },
    { id: 'DS-1680886400', date: '2023-04-07', status: 'Shipped', total: 89.99 },
];

export default function AccountOrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
        <CardDescription>View your order history and track your shipments.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                    <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.length === 0 && (
            <div className="text-center py-16">
                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}