import { CalendarDays, ListPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProfileStatsProps {
  walletAddress: string;
  joinedDate: Date;
}

export const ProfileStats = ({ walletAddress, joinedDate }: ProfileStatsProps) => {
  const { data: listingsCount = 0 } = useQuery({
    queryKey: ['profile-listings-count', walletAddress],
    queryFn: async () => {
      console.log('Fetching listings count for wallet:', walletAddress);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single();

      if (!profile) {
        console.log('No profile found for wallet:', walletAddress);
        return 0;
      }

      const { count, error } = await supabase
        .from('pre_bond_listings')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id);

      if (error) {
        console.error('Error fetching listings count:', error);
        throw error;
      }

      console.log('Listings count:', count);
      return count || 0;
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <ListPlus className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="text-2xl font-bold">{listingsCount}</h3>
          <p className="text-sm text-muted-foreground">Total Listings</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <CalendarDays className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="text-2xl font-bold">
            {joinedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <p className="text-sm text-muted-foreground">Joined</p>
        </CardContent>
      </Card>
    </div>
  );
};