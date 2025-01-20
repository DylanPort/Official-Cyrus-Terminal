export interface TokenData {
  mint: string;
  name: string;
  uri: string;
  symbol: string;
  marketCapSol: number;
  timestamp: number;
  vSolInBondingCurve: number;
  holderCount?: number;
  volume24h?: number;
}

export interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HolderData {
  address: string;
  balance: number;
}