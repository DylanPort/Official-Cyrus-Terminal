import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="relative">
        <img 
          src="/lovable-uploads/41e2100b-c00f-48a0-a833-0f66cc6755b6.png"
          alt="Loading..."
          className="w-16 h-16 animate-spin"
          style={{ animationDuration: '2s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl animate-pulse" />
      </div>
    </div>
  );
};