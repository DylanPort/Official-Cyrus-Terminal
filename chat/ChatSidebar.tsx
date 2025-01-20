import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ChatSidebarProps {
  listingName: string;
  members?: Array<{
    username: string;
    avatar_url?: string;
  }>;
}

export const ChatSidebar = ({ listingName, members = [] }: ChatSidebarProps) => {
  return (
    <div className="w-[240px] border-r border-border bg-card">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{listingName}</h3>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="text-sm">{members.length} members</span>
        </div>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(80vh-8rem)]">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium">Members</h4>
          </div>
          {members.map((member, index) => (
            <div key={index} className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar_url} />
                <AvatarFallback>{member.username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{member.username}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};