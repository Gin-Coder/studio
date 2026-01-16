
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-muted/10 min-h-screen">{children}</div>;
}
