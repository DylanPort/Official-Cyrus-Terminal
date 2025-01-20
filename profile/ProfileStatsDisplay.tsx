import { useState, useEffect } from 'react';
import { Calendar, ListFilter, Share2, X, Pencil } from 'lucide-react';
import { SnubCubeLogo } from '@/components/SnubCubeLogo';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface ProfileStatsDisplayProps {
  username: string;
  avatarUrl?: string;
  joinedDate: Date;
  totalListings: number;
  isOwner: boolean;
  onShare: () => void;
  onEdit: () => void;
}

export const ProfileStatsDisplay = ({
  username,
  avatarUrl,
  joinedDate,
  totalListings,
  isOwner,
  onShare,
  onEdit
}: ProfileStatsDisplayProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`relative w-full transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Top Menu */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={onShare}
          className="hover:bg-primary/20 transition-colors"
        >
          <Share2 className="h-4 w-4 text-primary" />
        </Button>
        {isOwner && (
          <Button
            onClick={onEdit}
            variant="ghost"
            className="flex items-center gap-2 hover:bg-primary/20 transition-colors"
          >
            <Pencil className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Edit Profile</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="hover:bg-primary/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-mint/5 animate-gradient-x rounded-lg" />
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="relative z-10 p-8">
        <div className="flex items-center gap-6">
          {/* Profile Avatar with 3D effect */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-mint rounded-full opacity-75 group-hover:opacity-100 transition-opacity animate-gradient-x blur" />
            <Avatar className="h-24 w-24 relative hover:scale-105 transition-transform duration-300">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback className="bg-gradient-to-br from-background via-muted to-card">
                <SnubCubeLogo />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Username with glow effect */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-mint animate-text-glow">
              {username}
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Listings Card */}
          <div className="group relative p-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative flex flex-col items-center justify-center p-4 glass-effect rounded-lg">
              <ListFilter className="w-8 h-8 mb-2 text-primary animate-float" />
              <span className="text-2xl font-bold text-foreground">{totalListings}</span>
              <span className="text-sm text-muted-foreground">Total Listings</span>
            </div>
          </div>

          {/* Joined Date Card */}
          <div className="group relative p-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-mint/20 via-background to-primary/20 opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative flex flex-col items-center justify-center p-4 glass-effect rounded-lg">
              <Calendar className="w-8 h-8 mb-2 text-mint animate-float" />
              <span className="text-2xl font-bold text-foreground">
                {format(joinedDate, 'MMMM yyyy')}
              </span>
              <span className="text-sm text-muted-foreground">Joined</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};