import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Rooms from "@/components/Rooms";
import Aquapark from "@/components/Aquapark";
import Dining from "@/components/Dining";
import Booking from "@/components/Booking";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

export default function Home() {
  return (
    <LanguageProvider>
      <div className="bg-white min-h-screen antialiased selection:bg-slate-900 selection:text-white">
        <Header />
        <main>
          <Hero />
          <About />
          <Rooms />
          <Aquapark />
          <Dining />
          <Booking />
          <Contacts />
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </LanguageProvider>
  );
}