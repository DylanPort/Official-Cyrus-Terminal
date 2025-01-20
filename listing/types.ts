export interface ListingFormData {
  name: string;
  ticker: string;
  description: string;
  image: File | null;
  category: "smart_contracts" | "web_apps" | "scripts" | "apis" | "memes";
  twitter: string;
  website: string;
  telegram: string;
  youtube: string;
  discord: string;
  twitch: string;
  instagram: string;
  linkedin: string;
  otherLinks: string;
}