import { Copy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface FundingWalletDisplayProps {
  fundingWalletAddress: string;
}

export const FundingWalletDisplay = ({ fundingWalletAddress }: FundingWalletDisplayProps) => {
  const { toast } = useToast();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fundingWalletAddress);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-accent/20">
        <h4 className="text-sm font-medium mb-2">Project Funding Wallet</h4>
        <div className="flex items-center gap-2">
          <code className="text-xs bg-background/50 p-2 rounded flex-1 overflow-hidden overflow-ellipsis">
            {fundingWalletAddress}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={handleCopyAddress}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
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