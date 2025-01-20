import { supabase } from '@/integrations/supabase/client';

export const getProfileId = async (walletAddress: string): Promise<string> => {
  console.log('Fetching profile for wallet:', walletAddress);
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single();

  if (error || !profile) {
    console.error('Error fetching profile:', error);
    throw new Error('Could not find user profile');
  }

  console.log('Found profile:', profile);
  return profile.id;
};