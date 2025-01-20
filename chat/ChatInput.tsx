import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send, Smile, X } from "lucide-react";
import { useState, useRef } from "react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
  replyTo?: { id: string, username: string } | null;
  onCancelReply?: () => void;
}

export const ChatInput = ({ 
  onSendMessage, 
  replyTo,
  onCancelReply 
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (message.trim() || isUploading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      console.log('Starting image upload...');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      console.log('Uploading file:', fileName);
      
      const { error: uploadError, data } = await supabase.storage
        .from('chat-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);
      onSendMessage("", publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };

  return (
    <div className="p-4 border-t space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {replyTo && (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Replying to @{replyTo.username}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={onCancelReply}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Image className="h-5 w-5" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Picker 
                data={data} 
                onEmojiSelect={handleEmojiSelect}
                theme="light"
              />
            </PopoverContent>
          </Popover>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isUploading ? "Uploading image..." : "Type a message..."}
            className="min-h-[20px] flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isUploading}
          />
        </div>
        <Button 
          onClick={handleSend} 
          size="icon" 
          className="shrink-0"
          disabled={isUploading || (!message.trim() && !isUploading)}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};