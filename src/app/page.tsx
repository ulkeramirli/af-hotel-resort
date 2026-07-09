'use client';

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import MobileOverview from "@/components/MobileOverview";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const About = dynamic(() => import("@/components/About"), { ssr: true });
const Rooms = dynamic(() => import("@/components/Rooms"), { ssr: true });
const Aquapark = dynamic(() => import("@/components/Aquapark"), { ssr: true });
const Wonderland = dynamic(() => import("@/components/Wonderland"), { ssr: true });
const Restoran = dynamic(() => import("@/components/Restoran"), { ssr: true });
const Reviews = dynamic(() => import("@/components/Reviews"), { ssr: true });
const Contacts = dynamic(() => import("@/components/Contacts"), { ssr: true });

export default function Home() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="w-full relative bg-stone-50">
      <Hero />

      {/* Mobile-only: beautiful overview of all hotel sections */}
      <MobileOverview />

      {/* 
        Hybrid Architecture: 
        These sections are hidden on mobile devices (where they have their own pages).
        They are only rendered on desktop.
      */}
      {isDesktop && (
        <div>
          <div className="relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/AF-hero.jpg')" }}>
            <div className="bg-white">
              <About />
            </div>
          </div>
          
          <div className="relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/AF-hotel.jpg')" }}>
            <div className="bg-stone-50">
              <Rooms />
            </div>
          </div>

          <div className="relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/AF-aqua.jpg')" }}>
            <div className="bg-white">
              <Aquapark />
            </div>
          </div>

          <div className="relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/AF-aqua2.jpg')" }}>
            <div className="bg-stone-900">
              <Wonderland />
            </div>
          </div>

          <div className="relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/AF-hotel.jpg')" }}>
            <div className="bg-white">
              <Restoran />
            </div>
          </div>

          <Reviews />
          <Contacts />
        </div>
      )}
    </div>
  );
}