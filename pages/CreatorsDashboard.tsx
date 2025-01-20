import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { EmptyState } from '@/components/listing/EmptyState';
import { useCreatorListings } from '@/hooks/useCreatorListings';

const CreatorsDashboard = () => {
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  const { data: listings, isLoading } = useCreatorListings();

  useEffect(() => {
    if (!connected || !publicKey) {
      console.log('No wallet connected, redirecting to auth');
      navigate('/auth');
    }
  }, [connected, publicKey, navigate]);

  if (!connected || !publicKey) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <Button
            onClick={() => navigate('/create-listing')}
            className="bg-gradient-to-r from-primary via-accent to-mint hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Listing
          </Button>
        </div>

        {listings && listings.length > 0 ? (
          <ListingGrid listings={listings} isLoading={isLoading} />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

export default CreatorsDashboard;