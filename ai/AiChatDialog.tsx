import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, X, Bot, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AiChatDialog = ({ open, onOpenChange }: AiChatDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey there! 👋 I'm your friendly AI market analyst. I can help you understand market trends and provide insights about the Solana ecosystem. Feel free to ask me anything - I promise to keep things both informative and entertaining! What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const { data: aiResponse, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: input }
      });

      if (error) throw error;

      const aiMessage = {
        role: 'assistant' as const,
        content: aiResponse.response
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Oops! 😅",
        description: "I had a brief brain freeze. Let's try that again!",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[500px] md:w-[600px] h-full p-0 bg-background/95 backdrop-blur-md border-l border-border/50"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 md:p-6 border-b border-border/50 bg-background/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div>
                  <SheetTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-mint bg-clip-text text-transparent animate-text-glow flex items-center gap-2">
                    Cyrus Wraith Personal AI Market Analyst
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  </SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">
                    Your friendly guide to market insights
                  </SheetDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 md:h-10 md:w-10"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </SheetHeader>
          
          <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'assistant' ? 'justify-start' : 'justify-end'
                  } animate-fade-up`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                    animation: 'fade-up 0.5s ease-out forwards'
                  }}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 shadow-lg transition-all duration-200 ${
                      message.role === 'assistant'
                        ? 'bg-muted/50 backdrop-blur-sm border border-border/50 rounded-tl-sm'
                        : 'bg-primary text-primary-foreground rounded-tr-sm'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fade-up">
                  <div className="max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-tl-sm">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0s' }}></span>
                      <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 md:p-6 border-t border-border/50 bg-background/50">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about market trends..."
                  className="bg-muted/50 border-border/50 rounded-xl text-sm md:text-base"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button 
                  onClick={handleSend}
                  className="bg-primary hover:bg-primary/90 transition-colors rounded-xl px-4 md:px-6"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};