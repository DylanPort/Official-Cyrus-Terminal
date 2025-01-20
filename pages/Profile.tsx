import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ProfileFormContainer } from '@/components/profile/ProfileFormContainer';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { ProfileStatsDisplay } from '@/components/profile/ProfileStatsDisplay';
import Navbar from '@/components/Navbar';

const Profile = () => {
  const { publicKey, connected } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const walletAddress = publicKey?.toString();
  
  const { data: profileData, isLoading } = useProfileData(walletAddress);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profileData?.username}'s Profile`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Profile link has been copied to clipboard",
      });
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source
              src="https://broewnzkfwaggbzsogvv.supabase.co/storage/v1/object/public/background-videos/cyber-grid1.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-4">Please connect your wallet to continue</p>
          <WalletMultiButton />
        </div>
      </div>
    );
  }

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
                src="https://broewnzkfwaggbzsogvv.supabase.co/storage/v1/object/public/background-videos/cyber-grid1.mp4"
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
                src="https://broewnzkfwaggbzsogvv.supabase.co/storage/v1/object/public/background-videos/cyber-grid1.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="text-center z-10">
            <h2 className="text-2xl font-bold mb-2">No Profile Found</h2>
            <p className="text-muted-foreground mb-4">Please create your profile first.</p>
            <button onClick={() => navigate('/auth')}>Create Profile</button>
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
              src="https://broewnzkfwaggbzsogvv.supabase.co/storage/v1/object/public/background-videos/cyber-grid1.mp4"
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
            isOwner={true}
            onShare={handleShare}
            onEdit={() => navigate('/profile/edit')}
          />
          
          <div className="mt-8">
            <ProfileFormContainer initialData={{
              username: profileData.username,
              email: profileData.email || '',
              description: profileData.description || '',
              x: profileData.social_links?.find(link => link.platform === 'x')?.username || '',
              telegram: profileData.social_links?.find(link => link.platform === 'telegram')?.username || '',
              github: profileData.social_links?.find(link => link.platform === 'github')?.username || '',
            }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;