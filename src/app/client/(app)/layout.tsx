// This layout ensures that client dashboard pages do not get the main
// public-facing Header and Footer from the root layout.
// For now, it is a simple pass-through, but can be extended with a
// client-specific sidebar or header if needed in the future.
export default function ClientAppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
