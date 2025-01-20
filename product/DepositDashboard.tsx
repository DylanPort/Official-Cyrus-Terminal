import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWallet } from '@solana/wallet-adapter-react';
import { DepositAmountButtons } from './deposit/DepositAmountButtons';
import { CurrentDepositDisplay } from './deposit/CurrentDepositDisplay';
import { VaultStatus } from './VaultStatus';
import { useDeposit } from '@/hooks/useDeposit';
import { useVaultStatus } from '@/hooks/useVaultStatus';

interface DepositDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  fundingWalletAddress: string;
  listingId: string;
}

export const DepositDashboard = ({ 
  isOpen, 
  onClose, 
  fundingWalletAddress, 
  listingId 
}: DepositDashboardProps) => {
  const { publicKey } = useWallet();
  const { data: vaultStatus } = useVaultStatus(listingId);
  const { isLoading, userDeposit, handleDeposit, handleRefund } = useDeposit(listingId);

  const isAcceptingDeposits = vaultStatus?.vault_status === 'accepting_deposits';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-black text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Deposit Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <VaultStatus listingId={listingId} />

          {isAcceptingDeposits ? (
            !userDeposit ? (
              <DepositAmountButtons
                onDeposit={handleDeposit}
                isLoading={isLoading}
              />
            ) : (
              <CurrentDepositDisplay
                depositAmount={userDeposit}
                onRefund={handleRefund}
                isLoading={isLoading}
              />
            )
          ) : (
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
              <p className="text-yellow-500">
                Deposits are no longer accepted as the token launch process has begun.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};