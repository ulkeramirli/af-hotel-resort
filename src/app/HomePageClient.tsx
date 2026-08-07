'use client';

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";

const About = dynamic(() => import("@/components/About"), { ssr: true });
const Rooms = dynamic(() => import("@/components/Rooms"), { ssr: true });
const Aquapark = dynamic(() => import("@/components/Aquapark"), { ssr: true });
const Wonderland = dynamic(() => import("@/components/Wonderland"), { ssr: true });
const Restoran = dynamic(() => import("@/components/Restoran"), { ssr: true });
const Reviews = dynamic(() => import("@/components/Reviews"), { ssr: true });
const Contacts = dynamic(() => import("@/components/Contacts"), { ssr: true });

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      // Give dynamic components a moment to mount
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, []);

  return (
    <main className="w-full relative bg-stone-50">
      <Hero />

      <div>
        <div className="relative bg-cover bg-center bg-scroll md:bg-fixed" style={{ backgroundImage: "url('/AF-hero.jpg')" }}>
          <div className="bg-white">
            <About />
          </div>
        </div>
        
        <div className="relative bg-cover bg-center bg-scroll md:bg-fixed" style={{ backgroundImage: "url('/AF-hotel.jpg')" }}>
          <div className="bg-stone-50">
            <Rooms />
          </div>
        </div>

        <div className="relative bg-cover bg-center bg-scroll md:bg-fixed" style={{ backgroundImage: "url('/AF-aqua.jpg')" }}>
          <div className="bg-white">
            <Aquapark />
          </div>
        </div>

        <div className="relative bg-cover bg-center bg-scroll md:bg-fixed" style={{ backgroundImage: "url('/AF-aqua2.jpg')" }}>
          <div className="bg-stone-900">
            <Wonderland />
          </div>
        </div>

        <div className="relative bg-cover bg-center bg-scroll md:bg-fixed" style={{ backgroundImage: "url('/AF-hotel.jpg')" }}>
          <div className="bg-white">
            <Restoran />
          </div>
        </div>

        <Reviews />
        <Contacts />
      </div>
    </main>
  );
}