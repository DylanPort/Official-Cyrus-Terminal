import { useState } from 'react';
import { LineChart as LineChartIcon, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Coins } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TokenData, PriceData } from './types';

interface PriceChartProps {
  token: TokenData;
}

export const PriceChart = ({ token }: PriceChartProps) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  const fetchPriceData = async (mint: string) => {
    setIsLoadingChart(true);
    try {
      const ws = new WebSocket('wss://pumpportal.fun/api/data');
      
      ws.onopen = () => {
        console.log('Fetching OHLC data for token:', mint);
        const query = {
          query: `{
            Solana {
              DEXTradeByTokens(
                limit: { count: 10 }
                orderBy: { descendingByField: "Block_Timefield" }
                where: {
                  Trade: {
                    Currency: {
                      MintAddress: { is: "${mint}" }
                    }
                    Dex: {
                      ProgramAddress: {
                        is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
                      }
                    }
                    PriceAsymmetry: { lt: 0.1 }
                  }
                }
              ) {
                Block {
                  Timefield: Time(interval: { in: minutes, count: 1 })
                }
                volume: sum(of: Trade_Amount)
                Trade {
                  high: Price(maximum: Trade_Price)
                  low: Price(minimum: Trade_Price)
                  open: Price(minimum: Block_Slot)
                  close: Price(maximum: Block_Slot)
                }
                count
              }
            }
          }`
        };

        ws.send(JSON.stringify({
          method: "getOHLC",
          mint: mint,
          query: query
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received OHLC data:', data);
        
        if (data.data?.Solana?.DEXTradeByTokens) {
          const formattedData = data.data.Solana.DEXTradeByTokens
            .map((trade: any) => ({
              timestamp: new Date(trade.Block.Timefield).getTime(),
              open: trade.Trade.open || 0,
              high: trade.Trade.high || 0,
              low: trade.Trade.low || 0,
              close: trade.Trade.close || 0,
              volume: trade.volume || 0
            }))
            .sort((a: PriceData, b: PriceData) => a.timestamp - b.timestamp);
          
          setPriceData(formattedData);
        }
        ws.close();
      };

      ws.onerror = (error) => {
        console.error('Error fetching OHLC data:', error);
        setPriceData([]);
      };

      ws.onclose = () => {
        setIsLoadingChart(false);
      };
    } catch (error) {
      console.error('Error setting up OHLC WebSocket:', error);
      setIsLoadingChart(false);
      setPriceData([]);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button 
          className="relative overflow-hidden px-4 py-2 rounded-lg bg-gradient-to-r from-[#FEC6A1] via-[#F97316] to-[#D946EF] bg-[length:400%_100%] hover:bg-[length:100%_100%] transition-all duration-700 text-white font-medium text-sm flex items-center justify-center gap-2 group"
          onClick={() => fetchPriceData(token.mint)}
        >
          <LineChartIcon className="h-4 w-4 transition-transform group-hover:scale-110 duration-500" />
          OHLC Chart
          <div className="absolute inset-0 bg-gradient-to-r from-[#FEC6A1]/10 via-[#F97316]/10 to-[#D946EF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={token.uri} alt={token.name} />
              <AvatarFallback>
                <Coins className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            {token.name} OHLC Chart
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 h-[500px]">
          {isLoadingChart ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : priceData.length > 0 ? (
            <ChartContainer 
              className="h-full"
              config={{
                line: {
                  color: "#8B5CF6"
                }
              }}
            >
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  className="text-xs text-muted-foreground"
                />
                <YAxis
                  className="text-xs text-muted-foreground"
                  tickFormatter={(value) => `${value.toFixed(6)} SOL`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  labelFormatter={(label) => formatTimestamp(label)}
                  formatter={(value: any, name: string) => [
                    `${Number(value).toFixed(6)} SOL`,
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="open"
                  stroke="#4ADE80"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="#F43F5E"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No price data available
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};