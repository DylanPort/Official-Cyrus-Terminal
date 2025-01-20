import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VotingSectionProps {
  listingId: string;
  userVote: 'up' | 'down' | null;
  upvotes: number;
  downvotes: number;
  onVoteChange: () => void;
}

export const VotingSection = ({ 
  listingId, 
  userVote, 
  upvotes, 
  downvotes,
  onVoteChange 
}: VotingSectionProps) => {
  const { publicKey } = useWallet();
  const { toast } = useToast();

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to vote",
      });
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single();

      if (profileError) throw profileError;

      if (userVote === voteType) {
        // Remove vote
        await supabase
          .from('listing_votes')
          .delete()
          .eq('listing_id', listingId)
          .eq('profile_id', profileData.id);
      } else {
        // Upsert vote
        await supabase
          .from('listing_votes')
          .upsert({
            listing_id: listingId,
            profile_id: profileData.id,
            vote_type: voteType,
          });
      }

      onVoteChange();
    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to vote. Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={userVote === 'up' ? 'default' : 'outline'}
        size="sm"
        className="gap-1"
        onClick={() => handleVote('up')}
      >
        <ArrowUp className="h-4 w-4" />
        <span>{upvotes}</span>
      </Button>
      <Button
        variant={userVote === 'down' ? 'default' : 'outline'}
        size="sm"
        className="gap-1"
        onClick={() => handleVote('down')}
      >
        <ArrowDown className="h-4 w-4" />
        <span>{downvotes}</span>
      </Button>
    </div>
  );
};