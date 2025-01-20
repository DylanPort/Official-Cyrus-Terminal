import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Youtube, MessageCircle, Twitch, Instagram, Linkedin, Link as LinkIcon } from "lucide-react";
import { ListingFormData } from "./types";

interface AdditionalInformationFormProps {
  formData: ListingFormData;
  onFormDataChange: (data: Partial<ListingFormData>) => void;
}

export const AdditionalInformationForm = ({
  formData,
  onFormDataChange,
}: AdditionalInformationFormProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Youtube className="h-5 w-5 text-red-600" />
          <Input
            placeholder="YouTube video URL"
            value={formData.youtube}
            onChange={(e) => onFormDataChange({ youtube: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-4">
          <MessageCircle className="h-5 w-5 text-[#7289DA]" />
          <Input
            placeholder="Discord invite link"
            value={formData.discord}
            onChange={(e) => onFormDataChange({ discord: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Twitch className="h-5 w-5 text-[#9146FF]" />
          <Input
            placeholder="Twitch channel"
            value={formData.twitch}
            onChange={(e) => onFormDataChange({ twitch: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Instagram className="h-5 w-5 text-[#E4405F]" />
          <Input
            placeholder="Instagram profile"
            value={formData.instagram}
            onChange={(e) => onFormDataChange({ instagram: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Linkedin className="h-5 w-5 text-[#0A66C2]" />
          <Input
            placeholder="LinkedIn profile URL"
            value={formData.linkedin}
            onChange={(e) => onFormDataChange({ linkedin: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-4">
          <LinkIcon className="h-5 w-5 text-muted-foreground" />
          <Textarea
            placeholder="Other links (one per line)"
            value={formData.otherLinks}
            onChange={(e) => onFormDataChange({ otherLinks: e.target.value })}
            className="min-h-[100px]"
          />
        </div>
      </div>
    </Card>
  );
};