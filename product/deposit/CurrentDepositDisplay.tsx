import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CurrentDepositDisplayProps {
  depositAmount: number;
  onRefund: () => void;
  isLoading: boolean;
}

export const CurrentDepositDisplay = ({ depositAmount, onRefund, isLoading }: CurrentDepositDisplayProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-400">Current Deposit</p>
        <p className="text-2xl font-bold text-green-500">{depositAmount} SOL</p>
      </div>
      <Button
        onClick={onRefund}
        disabled={isLoading}
        className="w-full relative overflow-hidden group bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        <span className="relative">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refund (2% fee)'}
        </span>
      </Button>
    </div>
  );
};