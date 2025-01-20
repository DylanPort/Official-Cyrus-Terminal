import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfileData } from "@/hooks/useProfileData";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

interface ChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  listingName: string;
}

export const ChatDialog = ({ 
  isOpen, 
  onOpenChange, 
  listingId, 
  listingName 
}: ChatDialogProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [replyTo, setReplyTo] = useState<{ id: string, username: string } | null>(null);
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const { data: profile, refetch: refetchProfile } = useProfileData(publicKey?.toString());

  useEffect(() => {
    if (!listingId) return;

    const setupChatRoom = async () => {
      try {
        let { data: existingRoom, error: findError } = await supabase
          .from('chat_rooms')
          .select('id')
          .eq('listing_id', listingId)
          .maybeSingle();

        if (findError) {
          console.error('Error finding chat room:', findError);
          throw findError;
        }

        let roomId;
        if (!existingRoom) {
          const { data: newRoom, error: createError } = await supabase
            .from('chat_rooms')
            .insert([{ listing_id: listingId }])
            .select()
            .single();

          if (createError) {
            console.error('Error creating chat room:', createError);
            throw createError;
          }
          roomId = newRoom.id;
        } else {
          roomId = existingRoom.id;
        }

        // Subscribe to realtime updates for messages
        const messageChannel = supabase
          .channel(`room:${roomId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'chat_messages',
              filter: `room_id=eq.${roomId}`,
            },
            (payload) => {
              console.log('Message update received:', payload);
              fetchMessages(roomId);
            }
          )
          .subscribe();

        // Subscribe to profile changes
        const profileChannel = supabase
          .channel('public:profiles')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'profiles'
            },
            (payload) => {
              console.log('Profile update received:', payload);
              fetchMessages(roomId);
              refetchProfile();
            }
          )
          .subscribe();

        fetchMessages(roomId);

        return () => {
          supabase.removeChannel(messageChannel);
          supabase.removeChannel(profileChannel);
        };
      } catch (error) {
        console.error('Error in setupChatRoom:', error);
        toast({
          title: "Error",
          description: "Failed to set up chat room. Please try again.",
          variant: "destructive",
        });
      }
    };

    setupChatRoom();
  }, [listingId, toast, refetchProfile]);

  const fetchMessages = async (roomId: string) => {
    try {
      console.log('Fetching messages for room:', roomId);
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            description,
            wallet_address
          ),
          parent_message:parent_id (
            content,
            profiles (
              username
            )
          )
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      if (data) {
        console.log('Fetched messages with profiles:', data);
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if (!profile) return;

    try {
      const { data: room } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('listing_id', listingId)
        .maybeSingle();

      if (room) {
        const messageData: any = {
          room_id: room.id,
          profile_id: profile.id,
          content: content || '',
          parent_id: replyTo?.id || null,
        };

        if (imageUrl) {
          messageData.image_url = imageUrl;
        }

        const { error } = await supabase
          .from('chat_messages')
          .insert([messageData]);

        if (error) throw error;
        
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReplyMessage = (messageId: string, username: string) => {
    setReplyTo({ id: messageId, username });
  };

  const handleMentionUser = (username: string) => {
    // Add the username to the input
    // This will be implemented in the ChatInput component
  };

  if (!connected) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Please connect your wallet to join the chat.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{listingName} Community Chat</DialogTitle>
          <DialogDescription>
            Chat with other community members about {listingName}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex h-[calc(80vh-8rem)]">
          <ChatSidebar
            listingName={listingName}
            members={messages
              .map(m => m.profiles)
              .filter((p, i, arr) => 
                p && arr.findIndex(x => x?.username === p.username) === i
              )}
          />
          <div className="flex-1 flex flex-col">
            <ChatMessages
              messages={messages}
              currentProfileId={profile?.id}
              onDeleteMessage={handleDeleteMessage}
              onReplyMessage={handleReplyMessage}
              onMentionUser={handleMentionUser}
            />
            <ChatInput 
              onSendMessage={handleSendMessage}
              replyTo={replyTo}
              onCancelReply={() => setReplyTo(null)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};