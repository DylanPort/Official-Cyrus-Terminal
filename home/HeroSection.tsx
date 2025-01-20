import React from 'react';
import { useNavigate } from "react-router-dom";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import Spline from '@splinetool/react-spline';
import { BenefitsMap } from '@/components/BenefitsMap';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-24 pb-16 px-4 bg-background relative overflow-hidden">
      <div className="matrix-bg">
        <Spline 
          scene="https://prod.spline.design/ZkZVOEkOPxyPPZHJ/scene.splinecode"
          className="w-full h-full absolute inset-0 -z-10"
        />
      </div>
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between relative z-20">
        <div className="lg:w-1/2 animate-fade-up">
          <p className="flex items-center gap-2 text-lg mb-4 glass-effect inline-block px-4 py-2 rounded-full">
            <span className="w-4 h-4 bg-[#4ade80] rounded-sm animate-pulse"></span>
            <span className="font-mono text-[#4ade80] animate-text-glow">
              Decentralized Token Pre-Bond Listings
            </span>
          </p>
          <div className="h-[200px] mt-32 -ml-8">
            <GooeyText
              texts={[
                "CREATE",
                "IMAGINE",
                "BELIEVE",
                "YOU ARE EARLY"
              ]}
              morphTime={1}
              cooldownTime={2}
              className="font-bold"
              textClassName="bg-gradient-to-r from-[#4ade80] via-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text transition-all duration-300"
            />
          </div>
          <p className="text-muted-foreground mb-8 text-lg mt-[-2rem]">
            Explore a wide array of smart contracts, web apps, scripts, APIs, and memes before they hit any market. A token's foundation is pivotal to its success or downfall, where early holders essentially make or break it. Cyrus-Terminal provides prebond listings and supports community members, projects, and early believers in maintaining stability.
          </p>
          <button 
            onClick={() => navigate('/marketplace')}
            className="group relative px-8 py-3 rounded-full overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d] via-[#00ffea] to-[#00ff9d] opacity-75 group-hover:opacity-100 animate-liquid-neon"></div>
            <div className="absolute inset-0 rounded-full border border-[#00ff9d]/40 backdrop-blur-sm group-hover:border-[#00ff9d]/60 transition-colors"></div>
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse bg-gradient-to-r from-[#00ff9d]/20 via-[#00ffea]/20 to-[#00ff9d]/20"></div>
            <div className="relative flex items-center gap-2 text-white font-medium">
              <span className="animate-text-glow">Pre-Bond Listings</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </div>
          </button>
        </div>

        <div className="lg:w-1/2 mt-8 lg:mt-0 relative">
          <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-primary/30 rounded-full opacity-50 blur-3xl animate-pulse"></div>
          <div className="absolute -z-10 bottom-0 right-20 w-48 h-48 bg-accent/20 rounded-full opacity-30 blur-3xl animate-pulse"></div>
          <div className="glass-effect p-8 rounded-2xl relative">
            <BenefitsMap />
          </div>
        </div>
      </div>
    </section>
  );
};