import { ArrowUp, ArrowDown, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  rating?: number;
  reviews?: number;
}

const ProductCard = ({ id, name, price, image }: ProductCardProps) => {
  const navigate = useNavigate();

  // Fetch upvotes
  const { data: upvotes = 0 } = useQuery({
    queryKey: ['votes', id, 'up'],
    queryFn: async () => {
      const { count } = await supabase
        .from('listing_votes')
        .select('*', { count: 'exact', head: true })
        .eq('listing_id', id)
        .eq('vote_type', 'up');
      return count || 0;
    }
  });

  // Fetch downvotes
  const { data: downvotes = 0 } = useQuery({
    queryKey: ['votes', id, 'down'],
    queryFn: async () => {
      const { count } = await supabase
        .from('listing_votes')
        .select('*', { count: 'exact', head: true })
        .eq('listing_id', id)
        .eq('vote_type', 'down');
      return count || 0;
    }
  });

  // Fetch community members count with improved error handling
  const { data: memberCount = 0 } = useQuery({
    queryKey: ['community-members', id],
    queryFn: async () => {
      try {
        // First try to get existing chat room
        const { data: chatRoom } = await supabase
          .from('chat_rooms')
          .select('id')
          .eq('listing_id', id)
          .single();

        if (!chatRoom) {
          console.log('No chat room found for listing:', id);
          return 0;
        }

        // Get member count for the room
        const { data: members, error } = await supabase
          .from('chat_room_members')
          .select('id')
          .eq('room_id', chatRoom.id);

        if (error) {
          console.error('Error fetching member count:', error);
          return 0;
        }

        return members?.length || 0;
      } catch (error) {
        console.error('Error in memberCount query:', error);
        return 0;
      }
    },
    retry: false
  });

  // Calculate funding progress
  const fundingProgress = Math.min((upvotes / (upvotes + downvotes + 1)) * 100, 100);

  const handleCommunityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${id}?tab=community`);
  };

  const handleDepositClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${id}?action=deposit`);
  };

  return (
    <div 
      className="group bg-card neon-border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-foreground">{name}</h3>
        <p className="text-primary mt-1">{price}</p>
        
        {/* Funding Progress Section */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Funding Progress</span>
            <span className="text-primary font-medium animate-text-glow">
              {Math.round(fundingProgress)}%
            </span>
          </div>
          <div className="relative h-4 rounded-lg overflow-hidden bg-background/40 backdrop-blur-sm border border-primary/20">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
                backgroundSize: '4px 4px',
                backgroundPosition: '0 0, 2px 2px'
              }}
            />
            <div 
              className="relative h-full transition-all duration-1000 ease-out"
              style={{ width: `${fundingProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-liquid-neon" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 blur-md animate-pulse" />
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 animate-pulse opacity-50">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-float"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <ArrowUp className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent">{upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDown className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">{downvotes}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{memberCount}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={handleDepositClick}
            className="group relative w-full px-4 py-2 overflow-hidden rounded-lg bg-transparent text-white shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-liquid-neon" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
            <span className="relative flex items-center justify-center gap-2 text-sm font-semibold">
              <span className="animate-text-glow">Deposit Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 animate-float" />
            </span>
          </button>

          <button
            onClick={handleCommunityClick}
            className="group relative w-full px-4 py-2 overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
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
      </div>
    </div>
  );
};

export default ProductCard;
