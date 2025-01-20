import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ListingHistory } from '@/components/profile/ListingHistory';
import { ActivityFeed } from '@/components/profile/ActivityFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileStatsDisplay } from '@/components/profile/ProfileStatsDisplay';
import Navbar from '@/components/Navbar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProfileView = () => {
  const { walletAddress } = useParams();
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const { data: profileData, isLoading } = useProfileData(walletAddress);
  const isOwner = publicKey?.toString() === walletAddress;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profileData?.username}'s Profile`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      setShowShareDialog(true);
    }
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Profile link has been copied to clipboard",
    });
    setShowShareDialog(false);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="fixed inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-20"
            >
              <source
                src="https://broewnzkfwaggbzsogvv.supabase.co/storage/v1/object/public/background-videos/cyber-grid.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <Loader2 className="w-8 h-8 animate-spin z-10" />
        </div>
      </>
    );
  }

  if (!profileData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="fixed inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-20"
            >
              <source
                src="https://broewnzkfwaggbzsogvv.supabase.co/storage/v1/object/public/background-videos/cyber-grid.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="text-center z-10">
            <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground">This profile doesn't exist or has been removed.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-4 relative">
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source
            src="https://broewnzkfwaggbzsogvv.supabase.co/storage/v1/object/public/background-videos/cyber-grid.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div className="container mx-auto max-w-7xl relative z-10">
        <ProfileStatsDisplay 
          username={profileData.username}
          avatarUrl={profileData.avatar_url}
          joinedDate={new Date(profileData.created_at)}
          totalListings={0}
          isOwner={isOwner}
          onShare={handleShare}
          onEdit={() => navigate('/profile/edit')}
        />

        <div className="mt-8">
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="listings">
              <Card className="p-6">
                <ListingHistory walletAddress={walletAddress || ''} />
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card className="p-6">
                <ActivityFeed walletAddress={walletAddress || ''} />
              </Card>
            </TabsContent>

            <TabsContent value="about">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">About</h3>
                    <p className="text-muted-foreground">
                      {profileData.description || "No description provided"}
                    </p>
                  </div>
                  
                  {profileData.email && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Contact</h3>
                      <p className="text-muted-foreground">{profileData.email}</p>
                    </div>
                  )}

                  {profileData.social_links?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Social Links</h3>
                      <div className="space-y-2">
                        {profileData.social_links.map((link) => (
                          <div key={link.platform} className="flex items-center gap-2">
                            <span className="capitalize">{link.platform}:</span>
                            <a 
                              href={`https://${link.platform}.com/${link.username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              @{link.username}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Copy the profile link to share it with others.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={copyProfileLink}>
              Copy Link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
};

export default ProfileView;
