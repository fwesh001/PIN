import AuthorSidebar from '@/components/AuthorSidebar';

export default function AuthorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-blue-50 dark:bg-blue-950 lg:flex-row">
      <AuthorSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
