import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, Clock, Users, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const RevenueShareSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [tierInfo, setTierInfo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rankings, setRankings] = useState<Array<{ wallet_address: string; rank: number }>>([]);
  const [filteredRankings, setFilteredRankings] = useState<Array<{ wallet_address: string; rank: number }>>([]);
  const { publicKey } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .from('wallet-rankings')
          .download('token_holder.csv');

        if (error) {
          console.error('Error fetching CSV:', error);
          return;
        }

        const text = await data.text();
        const lines = text.split('\n');
        const parsedRankings = lines
          .slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const [wallet_address, rank] = line.split(',');
            return {
              wallet_address: wallet_address.trim(),
              rank: parseInt(rank?.trim() || (index + 1).toString())
            };
          });

        setRankings(parsedRankings);
        setFilteredRankings(parsedRankings);
      } catch (error) {
        console.error('Error processing rankings:', error);
        toast({
          title: "Error loading rankings",
          description: "Failed to load wallet rankings. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchRankings();
  }, [toast]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = rankings.filter(ranking =>
        ranking.wallet_address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRankings(filtered);
    } else {
      setFilteredRankings(rankings);
    }
  }, [searchQuery, rankings]);

  const checkEligibility = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to check eligibility.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      toast({
        title: "Coming Soon!",
        description: "This feature will be available after launch.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 100%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 0%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="text-center space-y-4 relative">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-text-gradient"
        >
          Revenue Share Program
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-muted-foreground text-lg"
        >
          Top 1000 $CYRUS holders participate in our revolutionary revenue sharing model
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mt-8 space-y-4"
      >
        <div className="relative group">
          <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary animate-pulse" />
          <Input
            type="text"
            placeholder="Search wallet address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/20 backdrop-blur-sm border border-gray-800 hover:border-primary/50 transition-colors duration-300"
          />
          <motion.div 
            className="absolute inset-0 -z-10 rounded-lg opacity-0 group-hover:opacity-100"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(74, 222, 128, 0)',
                '0 0 20px 2px rgba(74, 222, 128, 0.3)',
                '0 0 0 0 rgba(74, 222, 128, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-black/20 backdrop-blur-sm border border-gray-800 rounded-xl p-4 max-h-[60vh] overflow-y-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none rounded-xl" />
          
          {filteredRankings.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="py-2">Rank</th>
                  <th className="py-2">Wallet Address</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredRankings.map((ranking, index) => (
                    <motion.tr
                      key={ranking.wallet_address}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ 
                        delay: index * 0.03,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      className={`border-t border-gray-800 hover:bg-primary/5 transition-all duration-300 ${
                        ranking.rank <= 20 ? 'bg-gradient-to-r from-transparent via-primary/5 to-transparent' : ''
                      }`}
                    >
                      <td className="py-2">
                        <motion.div
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="text-primary font-semibold">
                            #{ranking.rank}
                          </span>
                          {ranking.rank <= 20 && (
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            >
                              <Sparkles className="w-4 h-4 text-yellow-500" />
                            </motion.div>
                          )}
                        </motion.div>
                      </td>
                      <td className="py-2">
                        <motion.span
                          className="font-mono text-sm relative group-hover:text-primary transition-colors duration-300"
                          whileHover={{ 
                            scale: 1.02,
                            color: "rgb(74, 222, 128)"
                          }}
                        >
                          {ranking.wallet_address}
                          <motion.div
                            className="absolute inset-0 -z-10"
                            initial={{ opacity: 0 }}
                            whileHover={{ 
                              opacity: 1,
                              transition: { duration: 0.2 }
                            }}
                            style={{
                              background: "linear-gradient(90deg, transparent, rgba(74, 222, 128, 0.1), transparent)",
                              backgroundSize: "200% 100%"
                            }}
                            animate={{
                              backgroundPosition: ["200% 0", "-200% 0"]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground py-4"
            >
              {searchQuery ? (
                <motion.div
                  className="flex items-center justify-center gap-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Wallet className="w-4 h-4" />
                  No wallets found matching your search
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center justify-center gap-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                  Loading rankings...
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Deposit Fee",
            fee: "0.5%",
            icon: <Coins className="w-6 h-6" />,
            description: "Per transaction"
          },
          {
            title: "Refund Fee",
            fee: "2%",
            icon: <Coins className="w-6 h-6" />,
            description: "Per transaction"
          },
          {
            title: "Migration Fee",
            fee: "1%",
            icon: <Coins className="w-6 h-6" />,
            description: "Of total vault fund"
          },
          {
            title: "Boost Fee",
            fee: "0.7 SOL",
            icon: <Sparkles className="w-6 h-6" />,
            description: "Trending boost"
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              {item.icon}
              <h3 className="font-semibold">{item.title}</h3>
            </div>
            <p className="text-2xl font-bold text-primary mb-2">{item.fee}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-gray-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Distribution Cycle</h3>
          </div>
          <p className="text-muted-foreground">
            All collected fees are accumulated in an escrow wallet and distributed every 15 days to the top 1000 $CYRUS holders in SOL.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-gray-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Distribution Tiers</h3>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex justify-between">
              <span>Top 20 holders</span>
              <span className="font-semibold text-primary">1% each (20% total)</span>
            </li>
            <li className="flex justify-between">
              <span>Holders 21-120</span>
              <span className="font-semibold text-primary">0.2% each (20% total)</span>
            </li>
            <li className="flex justify-between">
              <span>Holders 121-320</span>
              <span className="font-semibold text-primary">0.1% each (20% total)</span>
            </li>
            <li className="flex justify-between">
              <span>Holders 321-1000</span>
              <span className="font-semibold text-primary">0.044% each (30% total)</span>
            </li>
            <li className="flex justify-between border-t border-gray-800 mt-4 pt-4">
              <span>Treasury & Marketing</span>
              <span className="font-semibold text-primary">10% total</span>
            </li>
          </ul>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-8 text-center"
      >
        <Button
          onClick={checkEligibility}
          className="relative group overflow-hidden px-8 py-4 rounded-xl text-white font-bold text-lg shadow-xl
            bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 
            hover:from-orange-500 hover:via-red-500 hover:to-yellow-500
            transition-all duration-500 transform hover:scale-105
            animate-pulse-slow"
          disabled={loading}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-0 
              group-hover:opacity-30 transition-opacity duration-500"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.span
            className="relative z-10 flex items-center gap-2"
            animate={{
              textShadow: [
                "0 0 4px rgba(255,255,255,0.5)",
                "0 0 8px rgba(255,255,255,0.8)",
                "0 0 4px rgba(255,255,255,0.5)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Checking...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Claim
              </>
            )}
          </motion.span>
        </Button>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-black/90 backdrop-blur-lg border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              $CYRUS Holdings Check
            </DialogTitle>
            <DialogDescription>
              {tokenBalance !== null && (
                <div className="space-y-4 mt-4">
                  <motion.p 
                    className="text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Current Balance: <span className="font-bold text-primary">{tokenBalance.toLocaleString()} $CYRUS</span>
                  </motion.p>
                  <motion.p 
                    className="text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Status: <span className="font-bold text-primary">{tierInfo}</span>
                  </motion.p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};
