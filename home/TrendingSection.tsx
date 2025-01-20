import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { PumpFunSidebar } from "@/components/ai/PumpFunSidebar";

export const TrendingSection = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const { data: trendingListings = [], isLoading: loadingTrending } = useQuery({
    queryKey: ['trending-listings'],
    queryFn: async () => {
      console.log('Fetching trending listings...');
      const { data: votes } = await supabase
        .from('listing_votes')
        .select('listing_id, vote_type')
        .order('created_at', { ascending: false });

      const voteCounts = (votes || []).reduce((acc: Record<string, { up: number; down: number }>, vote) => {
        if (!acc[vote.listing_id]) {
          acc[vote.listing_id] = { up: 0, down: 0 };
        }
        if (vote.vote_type === 'up') acc[vote.listing_id].up++;
        else acc[vote.listing_id].down++;
        return acc;
      }, {});

      const topListingIds = Object.entries(voteCounts)
        .sort(([, a], [, b]) => (b.up - b.down) - (a.up - a.down))
        .slice(0, 4)
        .map(([id]) => id);

      if (topListingIds.length === 0) return [];

      const { data: listings, error } = await supabase
        .from('pre_bond_listings')
        .select('*')
        .in('id', topListingIds);

      if (error) {
        console.error('Error fetching trending listings:', error);
        throw error;
      }

      return (listings || []).sort((a, b) => {
        const scoreA = (voteCounts[a.id]?.up || 0) - (voteCounts[a.id]?.down || 0);
        const scoreB = (voteCounts[b.id]?.up || 0) - (voteCounts[b.id]?.down || 0);
        return scoreB - scoreA;
      });
    },
  });

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="flex gap-4 relative">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden absolute -right-2 top-1/2 transform -translate-y-1/2 z-50 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-primary/20 hover:border-primary/40 transition-all duration-300"
          >
            {showSidebar ? (
              <ChevronRight className="w-6 h-6 text-primary animate-pulse" />
            ) : (
              <ChevronLeft className="w-6 h-6 text-primary animate-pulse" />
            )}
          </button>

          <div className="glass-effect p-8 rounded-2xl relative overflow-hidden group max-w-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-mint/20 opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-mint opacity-20 blur group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-mint text-transparent bg-clip-text animate-gradient-x">
                Top Trending Pre-Bond Listings
              </h2>
              
              {loadingTrending ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : trendingListings.length > 0 ? (
                <div className="h-[400px] overflow-y-auto pr-4">
                  <div className="space-y-4">
                    {trendingListings.map((listing) => (
                      <div 
                        key={listing.id} 
                        className="glass-effect p-4 rounded-lg transform transition-all duration-300 hover:scale-[1.02] flex items-center gap-4 group cursor-pointer"
                        onClick={() => navigate(`/product/${listing.id}`)}
                      >
                        {listing.image_url && (
                          <img
                            src={listing.image_url}
                            alt={listing.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {listing.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {listing.description}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-xl text-muted-foreground animate-pulse">
                    No trending listings yet
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className={`
            md:relative absolute top-0 right-0 h-full z-40
            ${showSidebar ? 'translate-x-0' : 'translate-x-full'} 
            md:translate-x-0 transition-transform duration-300 ease-in-out
            w-full md:w-3/4
          `}>
            <PumpFunSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};