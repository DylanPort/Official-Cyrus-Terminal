import { Keypair } from '@solana/web3.js';

export const generateSolanaWallet = () => {
  const keypair = Keypair.generate();
  return {
    publicKey: keypair.publicKey.toString(),
    // We never store or expose the private key
  };
};