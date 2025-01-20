import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletSignupForm } from '@/components/auth/WalletSignupForm';
import { Loader2 } from "lucide-react";

const Auth = () => {
  const { publicKey, connected } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!connected || !publicKey) {
        setLoading(false);
        return;
      }

      try {
        console.log('Checking auth status for wallet:', publicKey.toString());
        
        // Wait for a moment to ensure auth is setup
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (!session) {
          console.log('No session found, waiting for auth setup...');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select()
          .eq('wallet_address', publicKey.toString())
          .maybeSingle();

        if (profileError) throw profileError;

        if (profile) {
          console.log('Profile found, redirecting to profile page');
          navigate(`/profile/${publicKey.toString()}`);
        } else {
          console.log('No profile found, showing signup form');
          setNeedsProfile(true);
        }
      } catch (error: any) {
        console.error('Auth check error:', error);
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to check authentication status",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [connected, publicKey, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 glass-effect rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to Cyrus-Terminal</h2>
          <p className="mt-2 text-muted-foreground">Connect your wallet to continue</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <WalletMultiButton />
        </div>

        {connected && publicKey && needsProfile && (
          <WalletSignupForm walletAddress={publicKey.toString()} />
        )}
      </div>
    </div>
  );
};

export default Auth;