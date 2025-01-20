import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TokenAnalysisRequest {
  contractAddress: string;
  analysisType: 'bundle' | 'transactions' | 'holders' | 'earlyBuyers' | 'topTraders';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { contractAddress, analysisType } = await req.json() as TokenAnalysisRequest;
    
    if (!contractAddress) {
      throw new Error('Contract address is required');
    }

    console.log(`Analyzing ${analysisType} for contract: ${contractAddress}`);

    const SOLANA_TRACKER_API_KEY = Deno.env.get('SOLANA_TRACKER_API_KEY');
    if (!SOLANA_TRACKER_API_KEY) {
      throw new Error('Missing API configuration');
    }

    const headers = {
      'Authorization': `Bearer ${SOLANA_TRACKER_API_KEY}`,
      'Content-Type': 'application/json'
    };

    let analysisData;
    switch (analysisType) {
      case 'bundle':
        analysisData = await analyzeBundleTransactions(contractAddress, headers);
        break;
      case 'transactions':
        analysisData = await analyzeTransactions(contractAddress, headers);
        break;
      case 'holders':
        analysisData = await analyzeHolders(contractAddress, headers);
        break;
      case 'earlyBuyers':
        analysisData = await analyzeEarlyBuyers(contractAddress, headers);
        break;
      case 'topTraders':
        analysisData = await analyzeTopTraders(contractAddress, headers);
        break;
      default:
        throw new Error('Invalid analysis type');
    }

    return new Response(
      JSON.stringify({ success: true, data: analysisData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})

async function analyzeBundleTransactions(contractAddress: string, headers: HeadersInit) {
  // Get team trades
  const teamTradesUrl = `https://gmgn.ai/defi/quotation/v1/trades/sol/${contractAddress}?limit=100&maker=&tag%5B%5D=creator&tag%5B%5D=dev_team`;
  const teamTradesResponse = await fetch(teamTradesUrl, { headers });
  const teamTradesData = await teamTradesResponse.json();

  // Get token info
  const tokenInfoUrl = `https://gmgn.ai/defi/quotation/v1/tokens/sol/${contractAddress}`;
  const tokenInfoResponse = await fetch(tokenInfoUrl, { headers });
  const tokenInfo = await tokenInfoResponse.json();

  const totalSupply = tokenInfo.data.token.launchpad?.toLowerCase() === "pump.fun" 
    ? 1_000_000_000 
    : tokenInfo.data.token.total_supply;

  const txHashes = new Set<string>();
  let totalAmount = 0;
  let transactions = 0;

  for (const trade of teamTradesData.data.history) {
    if (trade.event === "buy") {
      txHashes.add(trade.tx_hash);
    }
  }

  // Analyze each transaction
  const transactionDetails: Record<string, any> = {};
  
  for (const txHash of txHashes) {
    const txUrl = `https://api.solana.fm/v0/transfers/${txHash}`;
    const txResponse = await fetch(txUrl, { headers });
    const txData = await txResponse.json();

    if (Array.isArray(txData.result?.data)) {
      for (const action of txData.result.data) {
        if (action.action === "transfer" && action.token) {
          const amount = parseFloat(action.amount) / 1_000_000;
          totalAmount += amount;
          transactions++;
        }
      }
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

async function analyzeTransactions(contractAddress: string, headers: HeadersInit) {
  const url = `https://gmgn.ai/defi/quotation/v1/trades/sol/${contractAddress}?limit=100`;
  const response = await fetch(url, { headers });
  const data = await response.json();
  
  return {
    transactions: data.data.history.map((tx: any) => ({
      type: tx.event,
      maker: tx.maker,
      amount: tx.amount,
      timestamp: tx.timestamp
    }))
  };
}

async function analyzeHolders(contractAddress: string, headers: HeadersInit) {
  const url = `https://gmgn.ai/defi/quotation/v1/tokens/top_holders/sol/${contractAddress}?orderby=amount_percentage&direction=desc`;
  const response = await fetch(url, { headers });
  const data = await response.json();

  return {
    holders: data.data.map((holder: any) => ({
      address: holder.address,
      percentage: holder.amount_percentage,
      balance: holder.balance,
      value: holder.value
    }))
  };
}

async function analyzeEarlyBuyers(contractAddress: string, headers: HeadersInit) {
  const url = `https://gmgn.ai/defi/quotation/v1/trades/sol/${contractAddress}?revert=true`;
  const response = await fetch(url, { headers });
  const data = await response.json();

  return {
    earlyBuyers: data.data.history
      .filter((tx: any) => tx.event === "buy" && !tx.maker_token_tags.includes("creator"))
      .map((buyer: any) => ({
        address: buyer.maker,
        amount: buyer.amount,
        profit: buyer.realized_profit,
        timestamp: buyer.timestamp
      }))
  };
}

async function analyzeTopTraders(contractAddress: string, headers: HeadersInit) {
  const url = `https://gmgn.ai/defi/quotation/v1/tokens/top_traders/sol/${contractAddress}?orderby=profit&direction=desc`;
  const response = await fetch(url, { headers });
  const data = await response.json();

  return {
    traders: data.data.map((trader: any) => ({
      address: trader.address,
      totalProfit: trader.realized_profit,
      unrealizedProfit: trader.unrealized_profit,
      trades: trader.total_trades,
      winRate: trader.win_rate
    }))
  };
}