import { useVaultStatus } from '@/hooks/useVaultStatus';
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface VaultStatusProps {
  listingId: string;
}

export const VaultStatus = ({ listingId }: VaultStatusProps) => {
  const { data: vaultStatus, isLoading } = useVaultStatus(listingId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const totalAmount = vaultStatus?.total_vault_amount || 0;
  const progress = Math.min((totalAmount / 30) * 100, 100);
  const isLaunching = vaultStatus?.vault_status === 'launching_token';
  const isLaunched = vaultStatus?.token_address;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Vault Status</span>
        <span className="text-sm text-primary">
          {totalAmount.toFixed(2)} / 30 SOL
        </span>
      </div>

      <div className="relative h-4 rounded-lg overflow-hidden bg-background/40 backdrop-blur-sm border border-primary/20">
        <div className="absolute inset-0 opacity-20 bg-grid-pattern" />
        <Progress value={progress} className="h-full" />
      </div>

      <div className="text-sm text-muted-foreground">
        {isLaunched ? (
          <span className="text-green-500">Token launched! 🚀</span>
        ) : isLaunching ? (
          <span className="text-yellow-500">Token launch in progress...</span>
        ) : (
          <span>
            {(30 - totalAmount).toFixed(2)} SOL needed to trigger token launch
          </span>
        )}
      </div>
    </div>
  );
};