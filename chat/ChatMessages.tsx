import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Reply, AtSign } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useNavigate } from 'react-router-dom';
import { SnubCubeLogo } from "@/components/SnubCubeLogo";

interface ChatMessagesProps {
  messages: Array<{
    id: string;
    content: string;
    created_at: string;
    profile_id: string;
    is_edited: boolean;
    image_url?: string;
    parent_id?: string | null;
    profiles?: {
      username: string;
      avatar_url: string | null;
      description?: string | null;
      wallet_address?: string;
    } | null;
    parent_message?: {
      content: string;
      profiles?: {
        username: string;
      } | null;
    } | null;
  }>;
  currentProfileId?: string;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string) => void;
  onReplyMessage?: (messageId: string, username: string) => void;
  onMentionUser?: (username: string) => void;
}

export const ChatMessages = ({
  messages,
  currentProfileId,
  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
  onMentionUser,
}: ChatMessagesProps) => {
  const navigate = useNavigate();

  const handleProfileClick = (walletAddress?: string) => {
    if (walletAddress) {
      navigate(`/profile/${walletAddress}`);
    }
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {message.parent_id && message.parent_message && (
              <div className="ml-8 -mb-2 text-sm text-muted-foreground flex items-center gap-2">
                <Reply className="h-3 w-3" />
                <span>Replying to @{message.parent_message.profiles?.username}</span>
                <span className="opacity-50">"{message.parent_message.content.substring(0, 50)}..."</span>
              </div>
            )}
            <div
              className={`flex gap-2 ${
                message.profile_id === currentProfileId ? "flex-row-reverse" : ""
              }`}
            >
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto hover:bg-transparent"
                    onClick={() => handleProfileClick(message.profiles?.wallet_address)}
                  >
                    <Avatar className="h-8 w-8">
                      {message.profiles?.avatar_url ? (
                        <AvatarImage 
                          src={message.profiles.avatar_url} 
                          alt={message.profiles.username || 'User avatar'}
                        />
                      ) : (
                        <AvatarFallback className="bg-background">
                          <SnubCubeLogo />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar className="h-12 w-12">
                      {message.profiles?.avatar_url ? (
                        <AvatarImage 
                          src={message.profiles.avatar_url} 
                          alt={message.profiles.username || 'User avatar'}
                        />
                      ) : (
                        <AvatarFallback className="bg-background">
                          <SnubCubeLogo />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">
                        {message.profiles?.username || "Anonymous"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {message.profiles?.description || "No description available"}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-2"
                        onClick={() => onMentionUser?.(message.profiles?.username || '')}
                      >
                        <AtSign className="h-3 w-3 mr-1" />
                        Mention
                      </Button>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <div
                className={`group relative max-w-[80%] ${
                  message.profile_id === currentProfileId
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                } rounded-lg p-3`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto hover:bg-transparent"
                    onClick={() => handleProfileClick(message.profiles?.wallet_address)}
                  >
                    <p className="text-sm font-medium hover:underline">
                      {message.profiles?.username || "Anonymous"}
                    </p>
                  </Button>
                  <span className="text-xs opacity-70">
                    {format(new Date(message.created_at), "HH:mm")}
                  </span>
                </div>
                {message.content && (
                  <p className="mt-1 break-words">{message.content}</p>
                )}
                {message.image_url && (
                  <div className="mt-2">
                    <img 
                      src={message.image_url} 
                      alt="Chat attachment" 
                      className="max-w-full rounded-lg"
                    />
                  </div>
                )}
                {message.is_edited && (
                  <span className="text-xs opacity-70 ml-2">(edited)</span>
                )}
                {message.profile_id === currentProfileId && (
                  <div className="absolute right-0 top-0 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1 shadow-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onEditMessage?.(message.id)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => onDeleteMessage?.(message.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={() => onReplyMessage?.(message.id, message.profiles?.username || 'Anonymous')}
                >
                  <Reply className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
