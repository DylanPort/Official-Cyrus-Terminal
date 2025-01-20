import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DepositAmountButtonsProps {
  onDeposit: (amount: number) => void;
  isLoading: boolean;
}

export const DepositAmountButtons = ({ onDeposit, isLoading }: DepositAmountButtonsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[0.1, 0.5, 1].map((amount) => (
        <Button
          key={amount}
          onClick={() => onDeposit(amount)}
          disabled={isLoading}
          className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          <span className="relative">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `${amount} SOL`}
          </span>
        </Button>
      ))}
    </div>
  );
};