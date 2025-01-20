import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from "lucide-react";
import { ProfileForm } from './ProfileForm';
import { SocialLinksForm } from './SocialLinksForm';

interface WalletSignupFormProps {
  walletAddress: string;
}

export const WalletSignupForm = ({ walletAddress }: WalletSignupFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    description: '',
    x: '',
    telegram: '',
    github: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress || !formData.username || !formData.email) {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Creating profile for wallet:', walletAddress);

      const { error: profileError } = await supabase.from('profiles').insert({
        wallet_address: walletAddress,
        username: formData.username,
        email: formData.email,
        description: formData.description || null,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      const socialLinks = [
        { platform: 'x' as const, username: formData.x },
        { platform: 'telegram' as const, username: formData.telegram },
        { platform: 'github' as const, username: formData.github },
      ].filter(link => link.username);

      if (socialLinks.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('wallet_address', walletAddress)
          .single();

        if (profileData) {
          const { error: socialError } = await supabase
            .from('social_links')
            .insert(socialLinks.map(link => ({
              profile_id: profileData.id,
              platform: link.platform,
              username: link.username,
            })));

          if (socialError) {
            console.error('Social links error:', socialError);
            throw socialError;
          }
        }
      }

      toast({
        title: "Success!",
        description: "Your profile has been created.",
      });
      
      navigate(`/profile/${walletAddress}`);
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ProfileForm
        username={formData.username}
        email={formData.email}
        description={formData.description}
        onUsernameChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
        onEmailChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
        onDescriptionChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
      />

      <SocialLinksForm
        socialLinks={{ x: formData.x, telegram: formData.telegram, github: formData.github }}
        onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !formData.username || !formData.email}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating profile...
          </>
        ) : (
          "Create Profile"
        )}
      </Button>
    </form>
  );
};