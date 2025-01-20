import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, User, Mail, FileText } from "lucide-react";

interface ProfileFormProps {
  username: string;
  description: string;
  email: string;
  onUsernameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export const ProfileForm = ({
  username,
  description,
  email,
  onUsernameChange,
  onDescriptionChange,
  onEmailChange
}: ProfileFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Alert variant="default" className="bg-muted/50 border-primary/20 hover:border-primary/30 transition-all duration-300">
          <InfoIcon className="h-4 w-4 text-primary animate-pulse" />
          <AlertDescription className="text-foreground/80">
            Customize your profile on Snub-Cube. Make it uniquely yours!
          </AlertDescription>
        </Alert>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 group">
          <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-primary/80" />
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="Choose a display name"
            className="bg-background/50 border-border group-hover:border-primary/50 transition-all duration-300 focus:border-primary"
          />
          <p className="text-sm text-muted-foreground">
            This will be your public display name.
          </p>
        </div>

        <div className="space-y-2 group">
          <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary/80" />
            Bio
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Tell others about yourself..."
            className="min-h-[100px] resize-y bg-background/50 border-border group-hover:border-primary/50 transition-all duration-300 focus:border-primary"
          />
          <p className="text-sm text-muted-foreground">
            Share your experience and expertise
          </p>
        </div>

        <div className="space-y-2 group">
          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary/80" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Enter your email address"
            className="bg-background/50 border-border group-hover:border-primary/50 transition-all duration-300 focus:border-primary"
          />
          <p className="text-sm text-muted-foreground">
            Used for notifications about your listings (optional)
          </p>
        </div>
      </div>
    </div>
  );
};