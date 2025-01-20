import React from 'react';
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "../ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const FeaturedSection = () => {
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['featured-listings'],
    queryFn: async () => {
      console.log('Fetching featured listings...');
      const { data, error } = await supabase
        .from('pre_bond_listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }

      console.log('Fetched listings:', data);
      return data || [];
    },
  });

  return (
    <section className="py-16 overflow-hidden relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source 
            src="https://broewnzkfwaggbzsogvv.supabase.co/storage/v1/object/public/background-videos/Gen-3%20Alpha%20Turbo%202585754550,%20make%20it%20look%20like%20a%20,%20M%205.mp4?t=2025-01-11T21%3A24%3A19.357Z" 
            type="video/mp4" 
          />
        </video>
      </div>
      
      <div className="container mx-auto relative z-20">
        <h2 className="text-3xl font-bold mb-8 px-4 animate-fade-up">Featured Assets</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-mint opacity-20 blur-lg group-hover:opacity-30 transition duration-1000"></div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full rounded-xl bg-background/50 backdrop-blur-sm p-4"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {listings.map((listing) => (
                  <CarouselItem 
                    key={listing.id} 
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4 transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="p-1">
                      <ProductCard
                        id={listing.id}
                        name={listing.name}
                        price={`${listing.ticker || 'ETH'}`}
                        image={listing.image_url || "https://images.unsplash.com/photo-1483058712412-4245e9b90334"}
                        rating={4}
                        reviews={10}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 hover:scale-110 transition-transform" />
              <CarouselNext className="hidden md:flex -right-4 hover:scale-110 transition-transform" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};