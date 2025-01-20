import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import { SnubCubeLogo } from "@/components/SnubCubeLogo";

interface SocialLink {
  icon: React.ReactNode;
  url: string;
  label: string;
}

interface CreatorListing {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: string;
  created_at: string;
}

interface CreatorProfileProps {
  username: string;
  description: string | null;
  avatarUrl: string | null;
  socialLinks: SocialLink[];
  creatorListings: CreatorListing[];
}

export const CreatorProfile = ({
  username,
  description,
  avatarUrl,
  socialLinks,
  creatorListings
}: CreatorProfileProps) => {
  const navigate = useNavigate();

  console.log('Creator avatar URL:', avatarUrl); // Debug log

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-4 rounded-lg bg-card hover:bg-accent/10 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {avatarUrl ? (
                <AvatarImage 
                  src={avatarUrl} 
                  alt={username}
                  onError={(e) => {
                    console.error('Error loading avatar:', avatarUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <AvatarFallback className="bg-background">
                  <SnubCubeLogo />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h4 className="font-semibold group-hover:text-primary transition-colors">
                {username || 'Anonymous'}
              </h4>
              <p className="text-sm text-muted-foreground">Creator</p>
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Creator Profile</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {avatarUrl ? (
                <AvatarImage 
                  src={avatarUrl} 
                  alt={username}
                  onError={(e) => {
                    console.error('Error loading avatar:', avatarUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <AvatarFallback className="bg-background">
                  <SnubCubeLogo />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{username}</h2>
              <p className="text-muted-foreground mt-1">{description}</p>
              
              <div className="flex gap-2 mt-3">
                {socialLinks.map(({ icon, url, label }) => url && (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-accent/10 transition-colors"
                    title={label}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {creatorListings && creatorListings.length > 0 && (
            <div className="animate-fade-up">
              <h3 className="text-lg font-semibold mb-4">Other Projects by Creator</h3>
              <div className="grid grid-cols-2 gap-4">
                {creatorListings.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(`/product/${item.id}`);
                      window.location.reload();
                    }}
                    className="group cursor-pointer p-4 rounded-lg bg-card hover:bg-accent/10 transition-all duration-300"
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/10">
                        {item.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
