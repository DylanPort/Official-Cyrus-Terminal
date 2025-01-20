import { useState } from 'react';
import { Users, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Coins } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TokenData, HolderData } from './types';

interface HolderAnalysisProps {
  token: TokenData;
}

export const HolderAnalysis = ({ token }: HolderAnalysisProps) => {
  const [holders, setHolders] = useState<HolderData[]>([]);
  const [isLoadingHolders, setIsLoadingHolders] = useState(false);

  const fetchHolderData = async (mint: string) => {
    setIsLoadingHolders(true);
    console.log('Fetching holder data for mint:', mint);
    
    try {
      const ws = new WebSocket('wss://pumpportal.fun/api/data');
      
      ws.onopen = () => {
        console.log('WebSocket connection opened for holder data');
        const query = {
          method: "query",
          query: `{
            Solana(dataset: realtime) {
              BalanceUpdates(
                limit: { count: 10 }
                orderBy: { descendingByField: "BalanceUpdate_Holding_maximum" }
                where: {
                  BalanceUpdate: {
                    Currency: {
                      MintAddress: { is: "${mint}" }
                    }
                  },
                  Transaction: { Result: { Success: true } }
                }
              ) {
                BalanceUpdate {
                  Account {
                    Address
                  }
                  Holding: PostBalance(maximum: Block_Slot)
                }
              }
            }
          }`
        };
        ws.send(JSON.stringify(query));
      };

      ws.onmessage = (event) => {
        console.log('Received holder data:', event.data);
        const data = JSON.parse(event.data);
        
        if (data.data?.Solana?.BalanceUpdates) {
          const holderData = data.data.Solana.BalanceUpdates
            .map((update: any) => ({
              address: update.BalanceUpdate.Account.Address,
              balance: parseFloat(update.BalanceUpdate.Holding) || 0
            }))
            .sort((a: HolderData, b: HolderData) => b.balance - a.balance)
            .slice(0, 10);
            
          setHolders(holderData);
        }
        ws.close();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setHolders([]);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsLoadingHolders(false);
      };
    } catch (error) {
      console.error('Error fetching holder data:', error);
      setIsLoadingHolders(false);
      setHolders([]);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button 
          className="relative overflow-hidden px-4 py-2 rounded-lg bg-gradient-to-r from-[#1EAEDB] via-[#33C3F0] to-[#8B5CF6] bg-[length:400%_100%] hover:bg-[length:100%_100%] transition-all duration-700 text-white font-medium text-sm flex items-center justify-center gap-2 group"
          onClick={() => fetchHolderData(token.mint)}
        >
          <Users className="h-4 w-4 transition-transform group-hover:scale-110 duration-500" />
          Holder Analysis
          <div className="absolute inset-0 bg-gradient-to-r from-[#1EAEDB]/10 via-[#33C3F0]/10 to-[#8B5CF6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-[#1EAEDB]/20 via-[#33C3F0]/20 to-[#8B5CF6]/20 animate-[gradient-x_5s_ease-in-out_infinite] mix-blend-overlay"
            style={{
              maskImage: 'linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)',
              WebkitMaskImage: 'linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)',
            }}
          />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={token.uri} alt={token.name} />
              <AvatarFallback>
                <Coins className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            {token.name} Holders
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {isLoadingHolders ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : holders.length > 0 ? (
            <div className="space-y-4">
              {holders.map((holder, idx) => (
                <div 
                  key={holder.address} 
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {idx + 1}
                    </div>
                    <span className="font-mono text-sm truncate max-w-[180px]">
                      {holder.address}
                    </span>
                  </div>
                  <span className="font-medium text-sm text-primary">
                    {holder.balance?.toLocaleString() || '0'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              No holder data available
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};