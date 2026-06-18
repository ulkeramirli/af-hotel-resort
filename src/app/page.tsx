// src/app/page.tsx
'use client';

import Providers from "@/components/Providers"; 
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Rooms from "@/components/Rooms";
import Aquapark from "@/components/Aquapark";
import Dining from "@/components/Dining";
// import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Booking from "@/components/Booking";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

export default function Home() {
  return (
    <Providers> {/* LanguageProvider na Providers */}
      <div className="bg-white min-h-screen antialiased selection:bg-slate-900 selection:text-white">
        <Header />
        <main>
          <Hero />
          <About />
          <Rooms />
          {/* <Gallery /> */}
          <Aquapark />
          <Dining />
          <Reviews />
          <Booking />
          <Contacts />
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </Providers>
  );
}