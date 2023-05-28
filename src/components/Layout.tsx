import Footer from "./Footer";
import Navbar from "./Navbar";
import ThemeSwap from "./ui/ThemeSwap";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="relative mb-auto min-h-screen">
        <ThemeSwap></ThemeSwap>
        <div className="pt-16 md:px-6">{children}</div>
      </main>
      <Footer />
    </>
  );
}
