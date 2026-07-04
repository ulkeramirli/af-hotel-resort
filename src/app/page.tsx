'use client';

import Hero from "@/components/Hero";
import MobileOverview from "@/components/MobileOverview";
import About from "@/components/About";
import Rooms from "@/components/Rooms";
import Aquapark from "@/components/Aquapark";
import Wonderland from "@/components/Wonderland";
import Restoran from "@/components/Restoran";
import Reviews from "@/components/Reviews";
import Contacts from "@/components/Contacts";

export default function Home() {
  return (
    <div className="w-full relative bg-stone-50">
      <Hero />

      {/* Mobile-only: beautiful overview of all hotel sections */}
      <MobileOverview />

      {/* 
        Hybrid Architecture: 
        These sections are hidden on mobile devices (where they have their own pages).
        They are only visible on desktop (lg:block), restoring the single-page experience.
      */}
      <div className="hidden lg:block">
        <div className="relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/AF-hero.jpg')" }}>
          <div className="bg-white/95 backdrop-blur-sm">
            <About />
          </div>
        </div>
        
        <div className="relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/AF-hotel.jpg')" }}>
          <div className="bg-stone-50/90 backdrop-blur-md">
            <Rooms />
          </div>
        </div>

        <div className="relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/AF-aqua.jpg')" }}>
          <div className="bg-white/95 backdrop-blur-sm">
            <Aquapark />
          </div>
        </div>

        <div className="relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/AF-aqua2.jpg')" }}>
          <div className="bg-stone-900/85 backdrop-blur-sm">
            <Wonderland />
          </div>
        </div>

        <div className="relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/AF-hotel.jpg')" }}>
          <div className="bg-white/95 backdrop-blur-sm">
            <Restoran />
          </div>
        </div>

        <Reviews />
        <Contacts />
      </div>
    </div>
  );
}