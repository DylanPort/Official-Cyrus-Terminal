import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ListingHistoryProps {
  walletAddress: string;
}

export const ListingHistory = ({ walletAddress }: ListingHistoryProps) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadListings();
  }, [walletAddress]);

  const loadListings = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single();

      if (profile) {
        const { data: listings, error } = await supabase
          .from('pre_bond_listings')
          .select('*')
          .eq('profile_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setListings(listings || []);
      }
    } catch (error: any) {
      console.error('Error loading listings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load listings history",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No listings found. Create your first listing to get started!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex items-center space-x-4">
            {listing.image_url && (
              <img
                src={listing.image_url}
                alt={listing.name}
                className="w-12 h-12 rounded-md object-cover"
              />
            )}
            <div>
              <h3 className="font-medium">{listing.name}</h3>
              <p className="text-sm text-muted-foreground">{listing.ticker}</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(listing.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};