use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum DepositError {
    #[error("Invalid instruction")]
    InvalidInstruction,
    
    #[error("Not enough funds")]
    InsufficientFunds,
    
    #[error("Invalid deposit amount")]
    InvalidAmount,
}

impl From<DepositError> for ProgramError {
    fn from(e: DepositError) -> Self {
        ProgramError::Custom(e as u32)
    }
}