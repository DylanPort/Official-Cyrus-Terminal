import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface AvatarUploadProps {
  onFileSelect: (file: File) => void;
  currentAvatarUrl?: string;
}

export const AvatarUpload = ({ onFileSelect, currentAvatarUrl }: AvatarUploadProps) => {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentAvatarUrl || null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first.",
      });
      return;
    }

    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file.",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
        });
        return;
      }

      try {
        setUploading(true);
        
        // Create a user-specific folder path
        const walletAddress = publicKey.toString();
        const fileExt = file.name.split('.').pop();
        const fileName = `${walletAddress}/${Date.now()}.${fileExt}`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          throw uploadError;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        // Create a new file with the public URL
        const fileWithUrl = new File([file], fileName, { type: file.type });
        Object.defineProperty(fileWithUrl, 'publicUrl', {
          value: publicUrl,
          writable: false
        });

        onFileSelect(fileWithUrl);

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        toast({
          title: "Success",
          description: "Avatar uploaded successfully",
        });
      } catch (error: any) {
        console.error('Error uploading avatar:', error);
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: error.message || "Failed to upload avatar",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        {avatarPreview ? (
          <AvatarImage src={avatarPreview} alt="Profile" />
        ) : (
          <AvatarFallback>
            <User className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="avatar-upload"
          disabled={uploading}
        />
        <Label
          htmlFor="avatar-upload"
          className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Avatar'}
        </Label>
      </div>
    </div>
  );
};