import { useEffect, useRef, useState } from 'react';
import { TokenCard } from './pump-fun/TokenCard';
import { TokenData } from './pump-fun/types';
import { useQuery, useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = 'pump-fun-tokens';

export const PumpFunSidebar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const queryClient = useQueryClient();

  const { data: tokens = [], refetch } = useQuery({
    queryKey: ['pump-fun-tokens'],
    queryFn: () => {
      console.log('Fetching tokens from localStorage or initializing empty array');
      const storedTokens = localStorage.getItem(STORAGE_KEY);
      return storedTokens ? JSON.parse(storedTokens) : [];
    },
    initialData: () => {
      const storedTokens = localStorage.getItem(STORAGE_KEY);
      return storedTokens ? JSON.parse(storedTokens) : [];
    },
  });

  const refreshTokens = () => {
    console.log('Refreshing token list...');
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        method: "subscribeNewToken"
      }));
    }
  };

  useEffect(() => {
    console.log('Initializing PumpFun WebSocket connection...');
    
    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected');
        return;
      }

      wsRef.current = new WebSocket('wss://pumpportal.fun/api/data');

      wsRef.current.onopen = () => {
        console.log('Connected to PumpFun WebSocket');
        setIsConnected(true);
        refreshTokens();
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received new token data:', data);
          
          if (data.txType === 'create') {
            queryClient.setQueryData(['pump-fun-tokens'], (prevTokens: TokenData[] = []) => {
              const newTokens = [...prevTokens];
              const existingTokenIndex = newTokens.findIndex(t => t.mint === data.mint);
              
              const tokenData: TokenData = {
                name: data.name || 'New Token',
                symbol: data.symbol || '???',
                mint: data.mint,
                timestamp: Date.now(),
                marketCapSol: data.marketCapSol,
                vSolInBondingCurve: data.vSolInBondingCurve,
                holderCount: data.holderCount || 0,
                volume24h: data.volume24h || 0,
                uri: data.uri
              };

              if (existingTokenIndex !== -1) {
                newTokens[existingTokenIndex] = {
                  ...newTokens[existingTokenIndex],
                  ...tokenData
                };
              } else {
                newTokens.unshift(tokenData);
              }
              
              const filteredAndSortedTokens = newTokens
                .filter(t => (t.marketCapSol || 0) > 40)
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
                .slice(0, 10);

              // Store in localStorage
              localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAndSortedTokens));
              
              return filteredAndSortedTokens;
            });
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        setTimeout(connectWebSocket, 5000);
      };
    };

    connectWebSocket();

    intervalRef.current = setInterval(refreshTokens, 60000);

    return () => {
      console.log('Cleaning up WebSocket connection and interval...');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          method: "unsubscribeNewToken"
        }));
        wsRef.current.close();
      }
    };
  }, [queryClient]);

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative flex-1 ml-4 overflow-hidden rounded-lg w-full">
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(-45deg, #8B5CF6, #D946EF)',
              backgroundSize: '200% 200%',
              animation: 'gradient-x 15s ease infinite'
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <img 
              src="/lovable-uploads/34dd7681-1f92-4f4a-a43f-580cdd590267.png" 
              alt="Pill icon" 
              className="w-6 h-6"
            />
            Newly launched on Pump.fun (+40 SOL)
          </h2>
          <div className="flex items-center gap-2">
            <div 
              className={`h-2 w-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>

        <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
          {tokens.map((token: TokenData) => (
            <TokenCard
              key={token.mint}
              token={token}
              getTimeAgo={getTimeAgo}
            />
          ))}
          {tokens.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Loading tokens...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
