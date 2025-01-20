import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ActivityFeedProps {
  walletAddress: string;
}

export const ActivityFeed = ({ walletAddress }: ActivityFeedProps) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadActivities();
  }, [walletAddress]);

  const loadActivities = async () => {
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
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setActivities(listings || []);
      }
    } catch (error: any) {
      console.error('Error loading activities:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load activity feed",
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

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent activity found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Created new listing: {activity.name}</h4>
              <span className="text-sm text-muted-foreground">
                {new Date(activity.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {activity.description.length > 100 
                ? `${activity.description.substring(0, 100)}...` 
                : activity.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
