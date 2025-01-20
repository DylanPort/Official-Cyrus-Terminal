import React from 'react';
import { ChevronDown, Plus, ChevronUp, Check } from "lucide-react";

export const StepsSection = () => {
  return (
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
      <div className="container mx-auto max-w-6xl relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-4 glass-effect p-6 rounded-xl">
            <div className="w-20 h-20 mx-auto rounded-lg flex items-center justify-center bg-primary/20">
              <ChevronDown className="w-10 h-10 text-primary" />
            </div>
            <p className="text-sm text-primary">Step 1</p>
            <h3 className="font-semibold text-lg">Browse Assets</h3>
            <p className="text-muted-foreground text-sm">Explore potentially uptrending tokens without the rush and confusion market volatility</p>
          </div>
          
          <div className="text-center space-y-4 glass-effect p-6 rounded-xl">
            <div className="w-20 h-20 mx-auto rounded-lg flex items-center justify-center bg-accent/20">
              <Plus className="w-10 h-10 text-accent" />
            </div>
            <p className="text-sm text-accent">Step 2</p>
            <h3 className="font-semibold text-lg">Connect Wallet</h3>
            <p className="text-muted-foreground text-sm">Securely connect your crypto wallet</p>
          </div>

          <div className="text-center space-y-4 glass-effect p-6 rounded-xl">
            <div className="w-20 h-20 mx-auto rounded-lg flex items-center justify-center bg-mint/20">
              <ChevronUp className="w-10 h-10 text-mint" />
            </div>
            <p className="text-sm text-mint">Step 3</p>
            <h3 className="font-semibold text-lg">Deposit</h3>
            <p className="text-muted-foreground text-sm">Deposit funds before pump fun migration, and if you're not satisfied just click refund and get your SOL back immediately</p>
          </div>

          <div className="text-center space-y-4 glass-effect p-6 rounded-xl">
            <div className="w-20 h-20 mx-auto rounded-lg flex items-center justify-center bg-primary/20">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <p className="text-sm text-primary">Step 4</p>
            <h3 className="font-semibold text-lg">Just Relax</h3>
            <p className="text-muted-foreground text-sm">Claim your Tokens</p>
          </div>
        </div>
      </div>
    </section>
  );
};