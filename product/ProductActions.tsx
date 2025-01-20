import React, { useState } from 'react';
import { ArrowRight, Users } from "lucide-react";
import { DepositDashboard } from './DepositDashboard';

interface ProductActionsProps {
  onDepositClick: () => void;
  onCommunityClick: () => void;
  memberCount: number;
  fundingWalletAddress: string;
  listingId: string;
}

export const ProductActions = ({ 
  onDepositClick, 
  onCommunityClick, 
  memberCount,
  fundingWalletAddress,
  listingId
}: ProductActionsProps) => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const handleDepositClick = () => {
    setIsDepositOpen(true);
    onDepositClick();
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={handleDepositClick}
          className="group relative px-4 py-2 overflow-hidden rounded-lg bg-transparent text-white shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-liquid-neon" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          <span className="relative flex items-center justify-center gap-2 text-sm font-semibold">
            <span className="animate-text-glow">Deposit Now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 animate-float" />
          </span>
        </button>

        <button
          onClick={onCommunityClick}
          className="group relative px-4 py-2 overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] animate-gradient-x" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          <span className="relative flex items-center justify-center gap-2 text-sm font-semibold text-white">
            <Users className="w-4 h-4 animate-float" />
            <span className="animate-text-glow">Join Community</span>
            <span className="ml-1 text-xs bg-primary/20 px-2 py-0.5 rounded-full">
              {memberCount} online
            </span>
          </span>
        </button>
      </div>

      <DepositDashboard
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        fundingWalletAddress={fundingWalletAddress}
        listingId={listingId}
      />
    </>
  );
};