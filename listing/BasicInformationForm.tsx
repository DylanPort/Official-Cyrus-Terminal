import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Twitter, Globe, MessageCircle } from "lucide-react";
import { ListingFormData } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInformationFormProps {
  formData: ListingFormData;
  onFormDataChange: (data: Partial<ListingFormData>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicInformationForm = ({
  formData,
  onFormDataChange,
  onImageChange,
}: BasicInformationFormProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Project Name *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => onFormDataChange({ name: e.target.value })}
            placeholder="Enter your project name"
          />
        </div>

        <div>
          <Label htmlFor="ticker">Token Ticker *</Label>
          <Input
            id="ticker"
            required
            value={formData.ticker}
            onChange={(e) => onFormDataChange({ ticker: e.target.value })}
            placeholder="e.g., BTC, ETH"
          />
        </div>

        <div>
          <Label htmlFor="category">Project Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => onFormDataChange({ category: value as ListingFormData['category'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="smart_contracts">Smart Contracts</SelectItem>
              <SelectItem value="web_apps">Web Applications</SelectItem>
              <SelectItem value="scripts">Scripts</SelectItem>
              <SelectItem value="apis">APIs</SelectItem>
              <SelectItem value="memes">Memes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => onFormDataChange({ description: e.target.value })}
            placeholder="Describe your project..."
            className="min-h-[150px]"
          />
        </div>

        <div>
          <Label htmlFor="image">Project Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="cursor-pointer"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Max file size: 2MB (optional)
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
            <Input
              placeholder="Twitter username"
              value={formData.twitter}
              onChange={(e) => onFormDataChange({ twitter: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Globe className="h-5 w-5 text-mint" />
            <Input
              placeholder="Website URL"
              value={formData.website}
              onChange={(e) => onFormDataChange({ website: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-4">
            <MessageCircle className="h-5 w-5 text-[#0088cc]" />
            <Input
              placeholder="Telegram username"
              value={formData.telegram}
              onChange={(e) => onFormDataChange({ telegram: e.target.value })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};