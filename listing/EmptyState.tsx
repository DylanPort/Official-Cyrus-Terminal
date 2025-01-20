import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
      <p className="text-muted-foreground mb-6">
        Create your first listing to start selling your digital assets
      </p>
      <Button
        onClick={() => navigate('/create-listing')}
        className="bg-gradient-to-r from-primary via-accent to-mint hover:opacity-90"
      >
        <Plus className="mr-2 h-4 w-4" /> Create First Listing
      </Button>
    </div>
  );
};