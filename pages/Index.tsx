import React, { useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CryptoNewsWidget } from "@/components/CryptoNewsWidget";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { AnalysisSection } from "@/components/home/AnalysisSection";
import { StepsSection } from "@/components/home/StepsSection";

const Index = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedSection />
      <TrendingSection />
      <AnalysisSection />
      <StepsSection />
      <Footer />
    </div>
  );
};

export default Index;