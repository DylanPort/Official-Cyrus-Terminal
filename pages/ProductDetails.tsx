import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from "../components/Navbar";
import { ProductHeader } from "@/components/product/ProductHeader";
import { CreatorProfile } from "@/components/product/CreatorProfile";
import { ProductLinks } from "@/components/product/ProductLinks";
import { ChatDialog } from '@/components/chat/ChatDialog';
import { ProductBackground } from '@/components/product/ProductBackground';
import { ProductProgress } from '@/components/product/ProductProgress';
import { ProductActions } from '@/components/product/ProductActions';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch upvotes
  const { data: upvotes = 0 } = useQuery({
    queryKey: ['votes', id, 'up'],
    queryFn: async () => {
      if (!id) return 0;
      const { count } = await supabase
        .from('listing_votes')
        .select('*', { count: 'exact', head: true })
        .eq('listing_id', id)
        .eq('vote_type', 'up');
      return count || 0;
    },
    enabled: !!id
  });

  // Fetch downvotes
  const { data: downvotes = 0 } = useQuery({
    queryKey: ['votes', id, 'down'],
    queryFn: async () => {
      if (!id) return 0;
      const { count } = await supabase
        .from('listing_votes')
        .select('*', { count: 'exact', head: true })
        .eq('listing_id', id)
        .eq('vote_type', 'down');
      return count || 0;
    },
    enabled: !!id
  });

  // Add live member count query
  const { data: memberCount = 0 } = useQuery({
    queryKey: ['community-members', id],
    queryFn: async () => {
      if (!id) return 0;
      try {
        const { data: room } = await supabase
          .from('chat_rooms')
          .select('id')
          .eq('listing_id', id)
          .maybeSingle();

        if (!room) return 0;

        const { count } = await supabase
          .from('chat_room_members')
          .select('*', { count: 'exact', head: true })
          .eq('room_id', room.id);

        return count || 0;
      } catch (error) {
        console.error('Error fetching member count:', error);
        return 0;
      }
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch listing details with social links
  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      if (!id) throw new Error('No listing ID provided');

      const { data, error } = await supabase
        .from('pre_bond_listings')
        .select(`
          *,
          profiles!pre_bond_listings_profile_id_fkey (
            username,
            avatar_url,
            description,
            social_links (
              platform,
              username
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
    retry: false
  });

  // Fetch creator's other listings
  const { data: creatorListings } = useQuery({
    queryKey: ['creator-listings', listing?.profile_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('pre_bond_listings')
        .select('*')
        .eq('profile_id', listing?.profile_id)
        .neq('id', id)
        .limit(4);
      return data;
    },
    enabled: !!listing?.profile_id,
  });

  useEffect(() => {
    if (error) {
      console.error('Error loading listing:', error);
      navigate('/marketplace');
    }
  }, [error, navigate]);

  const handleCommunityClick = () => {
    setIsChatOpen(true);
  };

  const handleDepositClick = () => {
    navigate(`/product/${id}?action=deposit`);
  };

  const handleExit = () => {
    navigate('/marketplace');
  };

  // Transform social links from the profiles data
  const socialLinks = listing?.profiles?.social_links?.map(link => ({
    icon: null, // You'll need to map the appropriate icon based on the platform
    url: `https://${link.platform}.com/${link.username}`,
    label: link.platform
  })) || [];

  const otherLinks = listing?.other_links
    ? listing.other_links.split('\n').filter(Boolean)
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-primary hover:underline"
          >
            Return to Marketplace
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <ProductBackground />
      
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <Card className="p-8 bg-background/80 backdrop-blur-sm relative">
          {/* Exit Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 hover:bg-background/20"
            onClick={handleExit}
          >
            <X className="h-4 w-4" />
          </Button>

          <ProductHeader
            id={listing.id}
            name={listing.name}
            description={listing.description}
            ticker={listing.ticker}
            imageUrl={listing.image_url}
            fundingWalletAddress={listing.funding_wallet_address}
            category={listing.category}
            creatorId={listing.profile_id}
          />

          <ProductProgress upvotes={upvotes} downvotes={downvotes} />

          <ProductActions
            onDepositClick={handleDepositClick}
            onCommunityClick={handleCommunityClick}
            memberCount={memberCount}
            fundingWalletAddress={listing.funding_wallet_address || ''}
            listingId={listing.id}
          />

          <Separator className="my-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CreatorProfile
              username={listing.profiles?.username || 'Anonymous'}
              description={listing.profiles?.description || ''}
              avatarUrl={listing.profiles?.avatar_url}
              socialLinks={socialLinks}
              creatorListings={creatorListings || []}
            />
          </div>

          <Separator className="my-8" />

          <ProductLinks
            socialLinks={socialLinks}
            otherLinks={otherLinks}
          />

          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="details">
              <AccordionTrigger>Additional Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Category</h3>
                    <p className="text-muted-foreground">{listing.category}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Created By</h3>
                    <p className="text-muted-foreground">
                      {listing.profiles?.username || 'Anonymous'}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <ChatDialog 
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          listingId={listing.id}
          listingName={listing.name}
        />
      </main>
    </div>
  );
};

export default ProductDetails;
