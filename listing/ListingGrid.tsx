import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Listing {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
}

interface ListingGridProps {
  listings: Listing[];
  isLoading: boolean;
}

export const ListingGrid = ({ listings, isLoading }: ListingGridProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Card
          key={listing.id}
          className="p-4 cursor-pointer hover:border-primary transition-colors"
          onClick={() => navigate(`/product/${listing.id}`)}
        >
          {listing.image_url && (
            <img
              src={listing.image_url}
              alt={listing.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          <h3 className="text-lg font-semibold mb-2">{listing.name}</h3>
          <p className="text-muted-foreground line-clamp-2">
            {listing.description}
          </p>
        </Card>
      ))}
    </div>
  );
};