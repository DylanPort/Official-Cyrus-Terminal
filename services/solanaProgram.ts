import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import BN from 'bn.js';
import { Schema, serialize } from 'borsh';
import { Buffer } from 'buffer';

// Ensure Buffer is available globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Define the program ID from your deployed contract
export const PROGRAM_ID = new PublicKey('Af5BNb6oTiZZ8pWwTW8Xgbsb4bqpaUtN5dHimLLKibWg');

// Define instruction variants
enum InstructionVariant {
  InitializeVault = 'InitializeVault',
  Deposit = 'Deposit',
  Refund = 'Refund'
}

// Instruction class for serialization
class DepositInstruction {
  variant: InstructionVariant;
  amount?: BN;

  constructor(variant: InstructionVariant, amount?: number) {
    this.variant = variant;
    if (amount !== undefined) {
      this.amount = new BN(amount);
    }
  }
}

// Schema for serializing instructions
const depositInstructionSchema: Schema = new Map([
  [
    DepositInstruction,
    {
      kind: 'struct',
      fields: [
        ['variant', 'string'],
        ['amount', { kind: 'option', type: 'u64' }]
      ]
    }
  ]
]);

export const findVaultPDA = async (listingId: string) => {
  console.log('Finding vault PDA for listing:', listingId);
  // Hash the listing ID to ensure consistent length
  const hashedId = Buffer.from(listingId).slice(0, 16); // Limit to 16 bytes
  
  try {
    const [pda] = await PublicKey.findProgramAddress(
      [
        Buffer.from('vault'),
        hashedId
      ],
      PROGRAM_ID
    );
    console.log('Generated PDA:', pda.toString());
    return pda;
  } catch (error) {
    console.error('Error generating PDA:', error);
    throw error;
  }
};

export const createDepositInstruction = async (
  depositor: PublicKey,
  listingId: string,
  amount: number
) => {
  console.log('Creating deposit instruction for amount:', amount);
  const vaultPDA = await findVaultPDA(listingId);
  const lamports = Math.floor(amount * 1e9); // Convert SOL to lamports and ensure integer

  try {
    const instruction = new DepositInstruction(InstructionVariant.Deposit, lamports);
    const data = Buffer.from(serialize(depositInstructionSchema, instruction));

    console.log('Instruction data created:', {
      programId: PROGRAM_ID.toString(),
      depositor: depositor.toString(),
      vaultPDA: vaultPDA.toString(),
      lamports
    });

    return {
      programId: PROGRAM_ID,
      keys: [
        { pubkey: depositor, isSigner: true, isWritable: true },
        { pubkey: vaultPDA, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    };
  } catch (error) {
    console.error('Error creating deposit instruction:', error);
    throw error;
  }
};

export const createRefundInstruction = async (
  depositor: PublicKey,
  listingId: string,
  amount: number
) => {
  const vaultPDA = await findVaultPDA(listingId);
  const lamports = Math.floor(amount * 1e9); // Convert SOL to lamports and ensure integer

  try {
    const instruction = new DepositInstruction(InstructionVariant.Refund, lamports);
    const data = Buffer.from(serialize(depositInstructionSchema, instruction));

    return {
      programId: PROGRAM_ID,
      keys: [
        { pubkey: depositor, isSigner: true, isWritable: true },
        { pubkey: vaultPDA, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    };
  } catch (error) {
    console.error('Error creating refund instruction:', error);
    throw error;
  }
};