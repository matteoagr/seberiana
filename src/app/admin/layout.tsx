export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="relative z-[1] flex min-h-full flex-1 flex-col">{children}</div>;
}
