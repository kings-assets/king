// This file is now a pass-through layout.
// The main admin layout with the sidebar has been moved to src/app/admin/(app)/layout.tsx
// to ensure it only applies to protected dashboard pages, not the login page.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
