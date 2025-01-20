import { Button } from "@/components/ui/button";
import { X, Github, Twitter, Send } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SocialLink {
  platform: string;
  username: string;
}

interface ProfileHeaderProps {
  username: string;
  description?: string;
  avatarUrl?: string;
  email?: string;
  socialLinks?: SocialLink[];
}

export const ProfileHeader = ({ 
  username, 
  description, 
  avatarUrl,
  email,
  socialLinks 
}: ProfileHeaderProps) => {
  const navigate = useNavigate();
  
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'x':
        return <Twitter className="h-4 w-4" />;
      case 'telegram':
        return <Send className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback className="text-2xl">{username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{username}</h1>
            {description && (
              <p className="text-muted-foreground max-w-md">{description}</p>
            )}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-2 mt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={`https://${link.platform}.com/${link.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {getSocialIcon(link.platform)}
                    </Button>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};