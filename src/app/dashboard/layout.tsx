/**
 * Dashboard layout — passthrough wrapper for role-based dashboard routes.
 *
 * Each role provides its own navigation (AuthorSidebar for /dashboard/author,
 * and the editor/reviewer pages render their own top headers), so this layout
 * intentionally does NOT render a shared sidebar to avoid duplicate nav bars.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
