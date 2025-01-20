import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from "../components/Navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import MarketplaceSidebar from '@/components/marketplace/MarketplaceSidebar';
import ProductCard from '@/components/ProductCard';

interface Listing {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: string;
  created_at: string;
  funding_amount: number | null;
}

const fetchListings = async () => {
  console.log('Starting fetchListings function...');
  
  const { data, error } = await supabase
    .from('pre_bond_listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }

  console.log('Fetched listings data:', data);
  return data || [];
};

const Marketplace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sortOrder, setSortOrder] = useState("newest");
  const [category, setCategory] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || "all";
  });

  const { data: listings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['listings'],
    queryFn: fetchListings,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });

  // Subscribe to real-time updates
  useEffect(() => {
    console.log('Setting up real-time subscription...');
    
    const channel = supabase
      .channel('listings-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'listings'
        },
        async (payload) => {
          console.log('New listing detected:', payload);
          toast({
            title: "New Project Added!",
            description: `${payload.new.name} has been added to the marketplace.`,
          });
          // Refetch the listings to include the new one
          await refetch();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription...');
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    console.log('Category changed to:', newCategory);
    setCategory(newCategory);
    const searchParams = new URLSearchParams(window.location.search);
    if (newCategory === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', newCategory);
    }
    navigate(`?${searchParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-red-500">Error loading listings. Please try again later.</div>
        </div>
      </div>
    );
  }

  const filteredListings = listings.filter((listing: Listing) => {
    return category === "all" || listing.category === category;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex pt-20">
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="cyber-grid" />
          
          <div className="relative z-10 mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-mint animate-neon-pulse">
              PRE-BOND LISTINGS
            </h1>
            <p className="text-accent max-w-2xl">
              Discover, analyze and deposit.
              The Trenches need believers not gamblers!
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-4 items-center justify-between mb-8">
            <div className="flex gap-4 items-center">
              <div className="text-sm text-accent">Available Items: {sortedListings.length}</div>
              
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px] glass-effect">
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="smart_contracts">Smart Contracts</SelectItem>
                  <SelectItem value="web_apps">Web Applications</SelectItem>
                  <SelectItem value="scripts">Scripts</SelectItem>
                  <SelectItem value="apis">APIs</SelectItem>
                  <SelectItem value="memes">Memes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px] glass-effect">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedListings.map((listing: Listing) => (
              <ProductCard
                key={listing.id}
                id={listing.id}
                name={listing.name}
                price={`${listing.funding_amount || 0} SOL`}
                image={listing.image_url || 'https://placehold.co/600x400/png'}
              />
            ))}
          </div>

          {sortedListings.length === 0 && (
            <div className="text-center text-muted-foreground mt-8">
              No listings found. Try adjusting your filters.
            </div>
          )}
        </main>
        
        <MarketplaceSidebar />
      </div>
    </div>
  );
};

export default Marketplace;
