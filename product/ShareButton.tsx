import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  listingName: string;
}

export const ShareButton = ({ listingName }: ShareButtonProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: listingName,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying the URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Project link copied to clipboard",
      });
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
};