import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { ProfileForm } from '@/components/auth/ProfileForm';
import { SocialLinksForm } from '@/components/auth/SocialLinksForm';
import { AvatarUpload } from '@/components/auth/AvatarUpload';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';

interface FormData {
  username: string;
  email: string;
  description: string;
  x: string;
  telegram: string;
  github: string;
  avatar_url?: string;
  profile_id?: string;
}

export const ProfileFormContainer = ({ initialData }: { initialData: FormData }) => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    setSaving(true);
    try {
      const walletAddress = publicKey.toString();
      console.log('Starting profile update for wallet:', walletAddress);
      console.log('Form data to be saved:', formData);

      // Validate username
      if (!formData.username || formData.username.trim() === '') {
        throw new Error('Username is required');
      }

      // First, get the profile ID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      if (!profile) {
        throw new Error('Profile not found');
      }

      console.log('Found profile:', profile);

      let avatarUrl = formData.avatar_url;
      if (avatarFile && 'publicUrl' in avatarFile) {
        avatarUrl = (avatarFile as any).publicUrl;
      }

      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: formData.username.trim(),
          email: formData.email || null,
          description: formData.description || null,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }

      // Delete existing social links
      const { error: deleteError } = await supabase
        .from('social_links')
        .delete()
        .eq('profile_id', profile.id);

      if (deleteError) {
        console.error('Error deleting social links:', deleteError);
        throw deleteError;
      }

      // Insert new social links if they exist
      const socialLinks = [
        { platform: 'x' as const, username: formData.x },
        { platform: 'telegram' as const, username: formData.telegram },
        { platform: 'github' as const, username: formData.github },
      ].filter(link => link.username);

      if (socialLinks.length > 0) {
        const { error: socialError } = await supabase
          .from('social_links')
          .insert(socialLinks.map(link => ({
            profile_id: profile.id,
            platform: link.platform,
            username: link.username,
          })));

        if (socialError) {
          console.error('Error inserting social links:', socialError);
          throw socialError;
        }
      }

      // Force a refetch of profile data
      await queryClient.invalidateQueries({ 
        queryKey: ['profile', walletAddress]
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      // Navigate to profile view
      navigate(`/profile/${walletAddress}`);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-20 z-0"
      >
        <source src="https://broewnzkfwaggbzsogvv.supabase.co/storage/v1/object/public/background-videos/cyber-grid1.mp4" type="video/mp4" />
      </video>

      {/* Animated Background Gradient */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-mint/5 z-0"
        style={{
          animation: "gradient-x 15s ease infinite",
          backgroundSize: "400% 400%"
        }}
      />

      <div className="relative z-10 container max-w-3xl mx-auto py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-up">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold animate-text-glow">Edit Profile</h1>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={saving || !formData.username?.trim()}
            className="bg-primary hover:bg-primary/90 transition-all duration-300 animate-fade-up"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>

        <Card className="backdrop-blur-sm bg-background/80 border-border hover:border-primary/50 transition-all duration-300">
          <div className="p-6 space-y-8">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center pb-6 border-b border-border animate-fade-up">
              <AvatarUpload 
                onFileSelect={(file) => setAvatarFile(file)}
                currentAvatarUrl={formData.avatar_url}
              />
            </div>

            {/* Profile Form Section */}
            <div className="space-y-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <ProfileForm
                username={formData.username}
                email={formData.email}
                description={formData.description}
                onUsernameChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
                onEmailChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                onDescriptionChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              />

              <div className="border-t border-border pt-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
                <SocialLinksForm
                  socialLinks={{ x: formData.x, telegram: formData.telegram, github: formData.github }}
                  onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};