import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Twitter, Send } from "lucide-react";

interface SocialLinksFormProps {
  socialLinks: {
    x: string;
    telegram: string;
    github: string;
  };
  onChange: (field: string, value: string) => void;
}

export const SocialLinksForm = ({ socialLinks, onChange }: SocialLinksFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-primary animate-text-glow">Social Links</h3>
      
      <div className="space-y-4">
        <div className="relative group">
          <Label htmlFor="x" className="text-sm font-medium flex items-center gap-2">
            <Twitter className="h-4 w-4 text-primary/80" />
            X (Twitter)
          </Label>
          <div className="relative mt-2">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-primary/80 transition-colors duration-300" />
            </div>
            <Input
              id="x"
              value={socialLinks.x}
              onChange={(e) => onChange('x', e.target.value)}
              placeholder="username (without @)"
              className="pl-10 bg-background/50 border-border group-hover:border-primary/50 transition-all duration-300 focus:border-primary"
            />
          </div>
        </div>

        <div className="relative group">
          <Label htmlFor="telegram" className="text-sm font-medium flex items-center gap-2">
            <Send className="h-4 w-4 text-primary/80" />
            Telegram
          </Label>
          <div className="relative mt-2">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Send className="h-4 w-4 text-muted-foreground group-hover:text-primary/80 transition-colors duration-300" />
            </div>
            <Input
              id="telegram"
              value={socialLinks.telegram}
              onChange={(e) => onChange('telegram', e.target.value)}
              placeholder="username"
              className="pl-10 bg-background/50 border-border group-hover:border-primary/50 transition-all duration-300 focus:border-primary"
            />
          </div>
        </div>

        <div className="relative group">
          <Label htmlFor="github" className="text-sm font-medium flex items-center gap-2">
            <Github className="h-4 w-4 text-primary/80" />
            GitHub
          </Label>
          <div className="relative mt-2">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Github className="h-4 w-4 text-muted-foreground group-hover:text-primary/80 transition-colors duration-300" />
            </div>
            <Input
              id="github"
              value={socialLinks.github}
              onChange={(e) => onChange('github', e.target.value)}
              placeholder="username"
              className="pl-10 bg-background/50 border-border group-hover:border-primary/50 transition-all duration-300 focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};