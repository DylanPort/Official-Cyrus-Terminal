import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { ProfileData } from '@/hooks/useProfileData';
import { Button } from "@/components/ui/button";
import { Share2, Pencil } from "lucide-react";

interface ProfileContentProps {
  profileData: ProfileData;
  isOwner: boolean;
  onShare: () => void;
  onEdit: () => void;
}

export const ProfileContent = ({ 
  profileData, 
  isOwner, 
  onShare, 
  onEdit 
}: ProfileContentProps) => {
  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <ProfileHeader 
          username={profileData.username}
          description={profileData.description}
          avatarUrl={profileData.avatar_url}
          email={profileData.email}
          socialLinks={profileData.social_links}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          {isOwner && (
            <Button
              onClick={onEdit}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <ProfileStats 
          walletAddress={profileData.wallet_address}
          joinedDate={new Date(profileData.created_at)}
        />
      </div>
    </>
  );
};