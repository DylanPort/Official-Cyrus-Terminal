import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Coins, BarChartHorizontal, Droplet, ExternalLink } from "lucide-react";
import { HolderAnalysis } from './HolderAnalysis';
import { PriceChart } from './PriceChart';
import { TokenData } from './types';

interface TokenCardProps {
  token: TokenData;
  getTimeAgo: (timestamp: number) => string;
}

export const TokenCard = ({ token, getTimeAgo }: TokenCardProps) => {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  return (
    <Card className="p-4 backdrop-blur-sm border-border/50 transition-all hover:bg-accent/10">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={token.uri} alt={token.name} />
              <AvatarFallback>
                <Coins className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{token.name}</span>
              <a 
                href={`https://pump.fun/coin/${token.mint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-500 hover:text-green-600 flex items-center gap-1 transition-colors group"
              >
                View on Pump.fun 
                <ExternalLink className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {token.symbol}
          </div>
          {token.marketCapSol && (
            <div className="flex items-center gap-2 text-sm">
              <BarChartHorizontal className="h-4 w-4 text-mint" />
              Market Cap: {token.marketCapSol.toFixed(2)} SOL
            </div>
          )}
          {token.vSolInBondingCurve && (
            <div className="flex items-center gap-2 text-sm">
              <Droplet className="h-4 w-4 text-blue-400" />
              Liquidity: {token.vSolInBondingCurve.toFixed(2)} SOL
            </div>
          )}
          
          <div className="flex flex-col gap-2 mt-2">
            <HolderAnalysis token={token} />
            <PriceChart token={token} />
          </div>
        </div>
        {token.timestamp && (
          <span className="text-xs text-muted-foreground">
            {getTimeAgo(token.timestamp)}
          </span>
        )}
      </div>
    </Card>
  );
};