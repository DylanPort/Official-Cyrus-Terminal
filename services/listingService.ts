import { supabase } from '@/integrations/supabase/client';
import { ListingFormData } from '@/components/listing/types';
import { uploadImage } from '@/utils/imageUtils';
import { getProfileId } from './profileService';

export const createListing = async (formData: ListingFormData, walletAddress: string) => {
  console.log('Starting listing creation process...');
  
  const profileId = await getProfileId(walletAddress);
  console.log('Profile ID:', profileId);

  let image_url = null;
  if (formData.image) {
    image_url = await uploadImage(formData.image);
    console.log('Image URL:', image_url);
  }

  const { data: listing, error: listingError } = await supabase
    .from('pre_bond_listings')
    .insert({
      name: formData.name,
      description: formData.description,
      ticker: formData.ticker,
      image_url: image_url,
      category: 'web_apps' as const, // Explicitly type as a literal
      profile_id: profileId,
      twitter: formData.twitter || null,
      website: formData.website || null,
      telegram: formData.telegram || null,
      youtube: formData.youtube || null,
      discord: formData.discord || null,
      twitch: formData.twitch || null,
      instagram: formData.instagram || null,
      linkedin: formData.linkedin || null,
      other_links: formData.otherLinks || null
    })
    .select()
    .single();

  if (listingError) {
    console.error('Error creating listing:', listingError);
    throw listingError;
  }

  console.log('Listing created successfully:', listing);
  return listing;
};