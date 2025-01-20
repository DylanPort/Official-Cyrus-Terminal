import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Terminal as TerminalIcon, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

type AnalysisType = 'bundle' | 'earlyBuyers' | 'topHolders' | 'transactions' | 'timestamp' | 'topTraders';

interface AnalysisResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const TokenAnalysisTerminal = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('bundle');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [threads, setThreads] = useState(40);
  const [useProxies, setUseProxies] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [buyers, setBuyers] = useState(40);
  const { toast } = useToast();

  const analyzeToken = async () => {
    // Show "coming soon" notification instead of performing analysis
    toast({
      title: "Coming Soon",
      description: "Available after official launch date",
      variant: "default",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#ea384c]/10 via-[#F97316]/10 to-[#9b87f5]/10 animate-gradient-x rounded-lg blur-xl" />
        
        <div className="glass-effect border border-primary/20 rounded-lg p-8 space-y-6 relative backdrop-blur-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <h2 className="text-2xl font-bold matrix-text-effect relative">
              <span className="bg-gradient-to-r from-[#ea384c] via-[#F97316] to-[#9b87f5] text-transparent bg-clip-text animate-text-gradient">
                Solana Token Analysis Terminal
              </span>
              <span className="absolute inset-0 typing-cursor"></span>
              <div className="matrix-overlay"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-sm text-primary/80">Contract Address</label>
              <Input
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="Enter Solana token contract address..."
                className="bg-background/50 border-primary/30 text-foreground placeholder:text-muted-foreground focus:ring-primary/30 focus:border-primary transition-all duration-300"
              />
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-sm text-primary/80">Analysis Type</label>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                className="w-full bg-background/50 border border-primary/30 rounded-md p-2 text-foreground focus:ring-primary/30 focus:border-primary transition-all duration-300"
              >
                <option value="bundle">Bundle Check</option>
                <option value="earlyBuyers">Early Buyers</option>
                <option value="topHolders">Top Holders</option>
                <option value="transactions">Transaction Analysis</option>
                <option value="timestamp">Timestamp Analysis</option>
                <option value="topTraders">Top Traders</option>
              </select>
            </motion.div>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-4">
              <label className="text-sm text-primary/80">Threads (1-100)</label>
              <Input
                type="number"
                min={1}
                max={100}
                value={threads}
                onChange={(e) => setThreads(Math.min(100, Math.max(1, parseInt(e.target.value) || 40)))}
                className="bg-background/50 border-primary/30 text-foreground focus:ring-primary/30 focus:border-primary transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={useProxies}
                onChange={(e) => setUseProxies(e.target.checked)}
                className="rounded border-primary/30 text-primary focus:ring-primary/30"
              />
              <label className="text-sm text-primary/80">Use Proxies</label>
            </div>
          </motion.div>

          <AnimatePresence>
            {analysisType === 'timestamp' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-primary/80">Start Time</label>
                    <Input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-background/50 border-primary/30 text-foreground focus:ring-primary/30 focus:border-primary transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-primary/80">End Time</label>
                    <Input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="bg-background/50 border-primary/30 text-foreground focus:ring-primary/30 focus:border-primary transition-all duration-300"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={analyzeToken}
            className="w-full bg-gradient-to-r from-[#F97316] via-[#ea384c] to-[#0EA5E9] hover:opacity-90 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#F2FCE2] via-[#000000] to-[#FEF7CD] -translate-x-full group-hover:translate-x-full transition-transform duration-1000 opacity-30" />
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4" />
              <span>Analyze Token</span>
            </div>
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-effect border border-primary/20 rounded-lg p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse-slow" />
            <div className="flex items-center gap-2 mb-4">
              <div className={`h-2 w-2 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm text-primary/80">
                {result.success ? 'Analysis Complete' : 'Analysis Failed'}
              </span>
            </div>
            
            <div className="relative">
              <pre className="whitespace-pre-wrap text-sm text-primary/80 bg-background/50 p-4 rounded-md overflow-x-auto">
                {result.success ? JSON.stringify(result.data, null, 2) : result.error}
              </pre>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse-slow opacity-50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
