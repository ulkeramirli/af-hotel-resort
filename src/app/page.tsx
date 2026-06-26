// src/app/page.tsx
'use client';

import Providers from "@/components/Providers"; 
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Booking from "@/components/Booking";
import About from "@/components/About";
import Rooms from "@/components/Rooms";
import Aquapark from "@/components/Aquapark";
import Restoran from "@/components/Restoran";
// import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import Wonderland from "@/components/Wonderland";

export default function Home() {
  return (
    <Providers> {/* LanguageProvider na Providers */}
      <div className="bg-white min-h-screen antialiased selection:bg-slate-900 selection:text-white overflow-x-hidden w-full relative">
        <Header />
        <main>
          <Hero />
          <About />
          <Rooms />
          {/* <Gallery /> */}
          <Aquapark />
          <Wonderland />
          <Restoran />
          <Reviews />
          <Contacts />
          <Booking />
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </Providers>
  );
}