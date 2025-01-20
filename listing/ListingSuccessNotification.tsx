import React from 'react';
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ListingSuccessNotificationProps {
  fundingWalletAddress: string;
}

export const ListingSuccessNotification = ({ fundingWalletAddress }: ListingSuccessNotificationProps) => {
  return (
    <div className="mt-2 space-y-4">
      <p>Your project has been listed successfully.</p>
      <div className="p-2 bg-secondary/30 rounded-lg">
        <p className="text-sm font-medium">Funding Wallet Address:</p>
        <p className="text-xs font-mono break-all">{fundingWalletAddress}</p>
      </div>
      
      <Alert variant="destructive" className="border-red-600/50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm font-semibold">
          WARNING: Do not send any funds to this wallet address. All funds sent will be permanently lost!
        </AlertDescription>
      </Alert>
    </div>
  );
};