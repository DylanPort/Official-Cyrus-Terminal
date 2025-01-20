import { LinkIcon } from "lucide-react";

interface ProductLinksProps {
  socialLinks: Array<{
    icon: React.ReactNode;
    url: string;
    label: string;
  }>;
  otherLinks: string[];
}

export const ProductLinks = ({ socialLinks, otherLinks }: ProductLinksProps) => {
  return (
    <div className="space-y-6">
      {socialLinks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialLinks.map(({ icon, url, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 rounded-lg bg-card hover:bg-accent/10 transition-colors"
              >
                {icon}
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {otherLinks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Additional Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 rounded-lg bg-card hover:bg-accent/10 transition-colors"
              >
                <LinkIcon className="h-5 w-5 text-muted-foreground" />
                <span className="truncate">{link}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};