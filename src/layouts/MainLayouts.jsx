import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import ScrollToTop from "../components/ui/ScrollToTop";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <ScrollToTop />

      <Header />
      <main>{children}</main>
      <Footer />

      <ScrollToTopButton />
    </div>
  );
}