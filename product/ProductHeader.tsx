import { Users } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FundingWalletDisplay } from "./FundingWalletDisplay";
import { VotingSection } from "./VotingSection";
import { ShareButton } from "./ShareButton";

interface ProductHeaderProps {
  id: string;
  name: string;
  description: string;
  ticker: string;
  imageUrl: string | null;
  fundingWalletAddress: string | null;
  category: string;
  creatorId: string;
  onCommunityClick?: () => void;
}

export const ProductHeader = ({
  id,
  name,
  description,
  ticker,
  imageUrl,
  fundingWalletAddress,
  category,
  creatorId,
  onCommunityClick,
}: ProductHeaderProps) => {
  const { publicKey } = useWallet();
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    fetchVotes();
    checkIfCreator();
  }, [publicKey]);

  const fetchVotes = async () => {
    try {
      const { data: votesData } = await supabase
        .from('listing_votes')
        .select('vote_type')
        .eq('listing_id', id);

      if (votesData) {
        setUpvotes(votesData.filter(v => v.vote_type === 'up').length);
        setDownvotes(votesData.filter(v => v.vote_type === 'down').length);
      }

      if (publicKey) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('wallet_address', publicKey.toString())
          .single();

        if (profileData) {
          const { data: userVoteData } = await supabase
            .from('listing_votes')
            .select('vote_type')
            .eq('listing_id', id)
            .eq('profile_id', profileData.id)
            .single();

          setUserVote(userVoteData?.vote_type || null);
        }
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const checkIfCreator = async () => {
    if (!publicKey) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single();

      setIsCreator(profileData?.id === creatorId);
    } catch (error) {
      console.error('Error checking creator status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image and basic info */}
        <div className="w-full lg:w-1/3">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full aspect-square object-cover rounded-lg"
            />
          ) : (
            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Project details */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-sm text-muted-foreground">{ticker}</p>
            </div>
            <div className="flex items-center gap-2">
              <VotingSection
                listingId={id}
                userVote={userVote}
                upvotes={upvotes}
                downvotes={downvotes}
                onVoteChange={fetchVotes}
              />
              <ShareButton listingName={name} />
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p>{description}</p>
          </div>

          {fundingWalletAddress && (
            <FundingWalletDisplay fundingWalletAddress={fundingWalletAddress} />
          )}
        </div>
      </div>
    </div>
  );
};