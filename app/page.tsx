'use client'

import Header from "@/components/travel/Header";
import Hero from "@/components/travel/Hero";
import Destinations from "@/components/travel/Destinations";
import WhyChooseUs from "@/components/travel/WhyChooseUs";
import Services from "@/components/travel/Services";
import Stats from "@/components/travel/Stats";
import Footer from "@/components/travel/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Header />
      <Hero />
      <Destinations />
      <WhyChooseUs />
      <Services />
      <Stats />
      <Footer />
    </div>
  );
}