import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

/** Cache public pages briefly so menu navigations stay fast. */
export const revalidate = 60;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="relative z-[1] flex-1">{children}</main>
      <Footer />
    </>
  );
}
