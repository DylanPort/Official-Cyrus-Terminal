import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Loader2, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface ListingPreview {
  id: string;
  name: string;
  image_url: string | null;
  funding_amount: number;
  created_at: string;
}

const MarketplaceSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Fetch funded projects (15-30 SOL)
  const { data: fundedProjects = [], isLoading: loadingFunded } = useQuery({
    queryKey: ['funded-projects'],
    queryFn: async () => {
      const { data } = await supabase
        .from('pre_bond_listings')
        .select('id, name, image_url, funding_amount, created_at')
        .gte('funding_amount', 15)
        .lt('funding_amount', 30)
        .order('funding_amount', { ascending: false })
        .limit(5);
      
      return data || [];
    },
  });

  // Fetch graduated projects (30+ SOL)
  const { data: graduatedProjects = [], isLoading: loadingGraduated } = useQuery({
    queryKey: ['graduated-projects'],
    queryFn: async () => {
      const { data } = await supabase
        .from('pre_bond_listings')
        .select('id, name, image_url, funding_amount, created_at')
        .gte('funding_amount', 30)
        .order('funding_amount', { ascending: false })
        .limit(5);
      
      return data || [];
    },
  });

  const renderListings = (listings: ListingPreview[], isLoading: boolean, title: string) => (
    <div className="mb-6 relative overflow-hidden rounded-xl group animate-float">
      {/* Darker gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-purple-900/40 to-orange-900/40 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-green-900/30 to-yellow-900/30 animate-gradient-y mix-blend-overlay"></div>
      
      {/* Darker cyber grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Darker neon glow effect */}
      <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_60%)]"></div>
      
      {/* Content with darker backdrop */}
      <div className="relative z-10 backdrop-blur-sm p-4 rounded-xl border border-cyan-800/30 bg-gray-900/20">
        <h3 className="text-lg font-semibold mb-3 relative group-hover:scale-105 transition-transform duration-300">
          {/* Bioluminescent text effect with darker base colors */}
          <span className="absolute inset-0 blur-sm bg-gradient-to-r from-[#15803d] via-[#22c55e] to-[#4ade80] bg-clip-text text-transparent animate-text-gradient">{title}</span>
          <span className="absolute inset-0 blur-[2px] bg-gradient-to-r from-[#15803d] via-[#22c55e] to-[#4ade80] bg-clip-text text-transparent animate-text-gradient" style={{ animationDelay: "0.1s" }}>{title}</span>
          <span className="relative bg-gradient-to-r from-[#15803d] via-[#22c55e] to-[#4ade80] bg-clip-text text-transparent animate-text-gradient font-bold" style={{ animationDelay: "0.2s" }}>{title}</span>
          {/* Darker glow overlay */}
          <span className="absolute inset-0 bg-gradient-to-r from-[#15803d]/20 via-[#22c55e]/20 to-[#4ade80]/20 blur-xl animate-pulse-slow mix-blend-overlay"></span>
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-700" />
          </div>
        ) : listings.length > 0 ? (
          <div className="space-y-3">
            {listings.map((listing) => (
              <Card 
                key={listing.id} 
                className="p-3 relative overflow-hidden group/card hover:scale-105 transition-all duration-300 animate-float border-cyan-800/30 hover:border-cyan-700/40 bg-gray-900/40"
              >
                {/* Card darker futuristic effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-purple-900/10 to-orange-900/10 group-hover/card:opacity-100 opacity-0 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:10px_10px] group-hover/card:opacity-100 opacity-0 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center gap-3 z-10">
                  {listing.image_url && (
                    <img
                      src={listing.image_url}
                      alt={listing.name}
                      className="w-12 h-12 rounded-md object-cover border border-cyan-800/30"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate group-hover/card:text-cyan-400 transition-colors">{listing.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {listing.funding_amount} SOL • {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No projects found</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button with darker background */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed right-0 top-1/2 transform -translate-y-1/2 z-50 bg-gray-900/80 backdrop-blur-sm p-2 rounded-l-lg border border-r-0 border-cyan-800/30 hover:bg-gray-800/90 transition-all duration-300 animate-pulse"
      >
        <ChevronLeft
          className={`w-6 h-6 text-cyan-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div className={`w-72 h-[calc(100vh-5rem)] relative overflow-hidden mt-20 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } md:translate-x-0`}>
        {/* Darker main background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-orange-900/20 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-green-900/20 to-yellow-900/20 animate-gradient-y mix-blend-overlay"></div>
        
        {/* Darker cyber grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
        
        {/* Content */}
        <ScrollArea className="h-full px-4 py-6 relative z-10 backdrop-blur-sm">
          {renderListings(fundedProjects, loadingFunded, "💰 Funded Projects")}
          {renderListings(graduatedProjects, loadingGraduated, "🎓 Graduated Projects")}
        </ScrollArea>
        
        {/* Darker border effect */}
        <div className="absolute inset-0 border-l border-cyan-800/20 pointer-events-none"></div>
      </div>
    </>
  );
};

export default MarketplaceSidebar;
