import React from 'react';
import { TokenAnalysisTerminal } from '@/components/terminal/TokenAnalysisTerminal';
import { FearAndGreedIndex } from '@/components/FearAndGreedIndex';
import { RevenueShareSection } from './RevenueShareSection';

export const AnalysisSection = () => {
  return (
    <>
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source 
              src="https://broewnzkfwaggbzsogvv.supabase.co/storage/v1/object/public/background-videos/Gen-3%20Alpha%20Turbo%202585754550,%20make%20it%20look%20like%20a%20,%20M%205.mp4?t=2025-01-11T21%3A24%3A19.357Z" 
              type="video/mp4" 
            />
          </video>
        </div>
        <div className="container mx-auto relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TokenAnalysisTerminal />
            <FearAndGreedIndex />
          </div>
        </div>
      </section>
      <RevenueShareSection />
    </>
  );
};