import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import UserAgent from 'https://esm.sh/user-agents@1.1.95'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

class BundleFinder {
  private txHashes: Set<string> = new Set();
  private headers: Record<string, string>;
  private userAgent: string;

  constructor() {
    this.randomizeSession();
  }

  private randomizeSession() {
    const ua = new UserAgent({ deviceCategory: 'desktop' });
    this.userAgent = ua.toString();
    this.headers = {
      'Host': 'gmgn.ai',
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'dnt': '1',
      'priority': 'u=1, i',
      'referer': 'https://gmgn.ai/?chain=sol',
      'user-agent': this.userAgent
    };
  }

  private formatTokens(amount: string): number {
    return parseFloat(amount) / 1_000_000;
  }

  async getTeamTrades(contractAddress: string): Promise<[Set<string>, number]> {
    try {
      console.log('Fetching team trades for contract:', contractAddress);
      
      const infoResponse = await fetch(
        `https://gmgn.ai/defi/quotation/v1/tokens/sol/${contractAddress}`,
        { headers: this.headers }
      );
      
      if (!infoResponse.ok) {
        throw new Error(`Failed to fetch token info: ${infoResponse.statusText}`);
      }
      
      const infoData = await infoResponse.json();
      const info = infoData.data.token;

      const tradesResponse = await fetch(
        `https://gmgn.ai/defi/quotation/v1/trades/sol/${contractAddress}?limit=100&maker=&tag%5B%5D=creator&tag%5B%5D=dev_team`,
        { headers: this.headers }
      );
      
      if (!tradesResponse.ok) {
        throw new Error(`Failed to fetch trades: ${tradesResponse.statusText}`);
      }
      
      const tradesData = await tradesResponse.json();
      const trades = tradesData.data.history;

      const totalSupply = info.launchpad?.toLowerCase() === "pump.fun" 
        ? 1_000_000_000 
        : info.total_supply;

      for (const buy of trades) {
        if (buy.event === "buy") {
          this.txHashes.add(buy.tx_hash);
        }
      }

      return [this.txHashes, totalSupply];
    } catch (error) {
      console.error('Error fetching team trades:', error);
      throw error;
    }
  }

  async checkBundle(txHashes: Set<string>, totalSupply: number) {
    let totalAmount = 0;
    let transactions = 0;
    const transactionDetails: Record<string, any> = {};

    for (const txHash of txHashes) {
      try {
        const response = await fetch(`https://api.solana.fm/v0/transfers/${txHash}`);
        if (!response.ok) {
          console.error(`Failed to fetch transaction ${txHash}: ${response.statusText}`);
          continue;
        }
        
        const data = await response.json();
        const actions = data?.result?.data || [];

        if (Array.isArray(actions)) {
          const amounts: number[] = [];
          
          for (const action of actions) {
            if (action.action === "transfer" && action.token) {
              const amount = this.formatTokens(action.amount);
              totalAmount += amount;
              transactions++;
              amounts.push(amount);
            }
          }

          if (amounts.length > 0) {
            const amountsPercentages = amounts.map(amount => (amount / totalSupply) * 100);
            transactionDetails[txHash] = {
              amounts,
              amountsPercentages
            };
          }
        }
      } catch (error) {
        console.error(`Error processing transaction ${txHash}:`, error);
      }
    }

    return {
      bundleDetected: transactions > 1,
      transactions,
      developerInfo: {
        bundledAmount: totalAmount,
        percentageOfSupply: totalAmount / totalSupply
      },
      transactionDetails
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contractAddress, analysisType } = await req.json();
    
    if (!contractAddress) {
      throw new Error('Contract address is required');
    }

    console.log(`Starting analysis for contract: ${contractAddress}`);

    const bundleFinder = new BundleFinder();
    let analysisData;

    try {
      const [txHashes, totalSupply] = await bundleFinder.getTeamTrades(contractAddress);
      analysisData = await bundleFinder.checkBundle(txHashes, totalSupply);
    } catch (error) {
      console.error('Analysis error:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: analysisData }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      }),
      { 
        headers: corsHeaders,
        status: 500
      }
    );
  }
})