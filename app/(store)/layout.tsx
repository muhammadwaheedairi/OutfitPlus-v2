import HeaderNav from "@/components/layout/header-nav";
import Footer from "@/components/layout/footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderNav />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}