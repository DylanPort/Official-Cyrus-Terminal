import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ProductProgressProps {
  upvotes: number;
  downvotes: number;
}

export const ProductProgress = ({ upvotes, downvotes }: ProductProgressProps) => {
  const fundingProgress = Math.min((upvotes / (upvotes + downvotes + 1)) * 100, 100);

  return (
    <div className="mt-6 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Funding Progress</span>
        <span className="text-primary font-medium animate-text-glow">
          {Math.round(fundingProgress)}%
        </span>
      </div>
      <div className="relative h-4 rounded-lg overflow-hidden bg-background/40 backdrop-blur-sm border border-primary/20">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
            backgroundSize: '4px 4px',
            backgroundPosition: '0 0, 2px 2px',
            animation: 'matrix-scan 20s linear infinite'
          }}
        />
        
        <div 
          className="relative h-full transition-all duration-1000 ease-out"
          style={{ width: `${fundingProgress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-liquid-neon" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 blur-md animate-pulse" />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              width: '20px',
              transform: 'skewX(-20deg)',
              animation: 'matrix-scan 2s linear infinite'
            }}
          />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 animate-pulse opacity-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};