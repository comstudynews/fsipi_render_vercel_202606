import { About } from "./components/About";
import { BusinessSection } from "./components/BusinessSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { InquiryForm } from "./components/InquiryForm";
import { NoticeSection } from "./components/NoticeSection";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <BusinessSection />
        <NoticeSection />
        <InquiryForm />
      </main>
      <Footer />
    </>
  );
}
