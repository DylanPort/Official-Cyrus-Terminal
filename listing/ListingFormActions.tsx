import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface ListingFormActionsProps {
  isSubmitting: boolean;
}

export const ListingFormActions = ({ isSubmitting }: ListingFormActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-4 pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/marketplace')}
        disabled={isSubmitting}
        className="hover:bg-accent"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-gradient-to-r from-primary via-accent to-mint hover:opacity-90 text-black font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Listing'
        )}
      </Button>
    </div>
  );
};