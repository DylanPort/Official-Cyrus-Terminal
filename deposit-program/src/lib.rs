use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    program::{invoke, invoke_signed},
    sysvar::Sysvar,
};

// Declare the program's entrypoint
entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum DepositInstruction {
    InitializeVault,
    Deposit { amount: u64 },
    Refund { amount: u64 },
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct VaultState {
    pub listing_creator: Pubkey,
    pub total_deposits: u64,
    pub deposits: Vec<Deposit>,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Deposit {
    pub depositor: Pubkey,
    pub amount: u64,
}

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = DepositInstruction::try_from_slice(instruction_data)?;
    
    match instruction {
        DepositInstruction::InitializeVault => {
            process_initialize_vault(program_id, accounts)
        }
        DepositInstruction::Deposit { amount } => {
            process_deposit(program_id, accounts, amount)
        }
        DepositInstruction::Refund { amount } => {
            process_refund(program_id, accounts, amount)
        }
    }
}

fn process_initialize_vault(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let listing_creator = next_account_info(account_info_iter)?;
    let vault_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    if !listing_creator.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let vault_state = VaultState {
        listing_creator: *listing_creator.key,
        total_deposits: 0,
        deposits: Vec::new(),
    };

    let space = vault_state.try_to_vec()?.len();
    let rent = Rent::get()?;
    let lamports = rent.minimum_balance(space);

    // Create the vault account with the program as the owner
    invoke_signed(
        &system_instruction::create_account(
            listing_creator.key,
            vault_account.key,
            lamports,
            space as u64,
            program_id,
        ),
        &[listing_creator.clone(), vault_account.clone(), system_program.clone()],
        &[],
    )?;

    // Initialize the vault state
    vault_state.serialize(&mut &mut vault_account.data.borrow_mut()[..])?;
    
    msg!("Vault initialized successfully");
    Ok(())
}

fn process_deposit(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let depositor = next_account_info(account_info_iter)?;
    let vault_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    // Verify accounts
    if !depositor.is_signer {
        msg!("Depositor must be a signer");
        return Err(ProgramError::MissingRequiredSignature);
    }

    if vault_account.owner != program_id {
        msg!("Vault account must be owned by the program");
        return Err(ProgramError::IllegalOwner);
    }

    msg!("Processing deposit of {} lamports", amount);

    // Load vault state
    let mut vault_state = VaultState::try_from_slice(&vault_account.data.borrow())?;

    // Transfer funds from depositor to vault
    invoke(
        &system_instruction::transfer(
            depositor.key,
            vault_account.key,
            amount,
        ),
        &[
            depositor.clone(),
            vault_account.clone(),
            system_program.clone()
        ],
    )?;

    // Update vault state with new deposit
    vault_state.deposits.push(Deposit {
        depositor: *depositor.key,
        amount,
    });
    vault_state.total_deposits += amount;

    // Save updated vault state
    vault_state.serialize(&mut &mut vault_account.data.borrow_mut()[..])?;

    msg!("Deposit successful");
    Ok(())
}

fn process_refund(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let depositor = next_account_info(account_info_iter)?;
    let vault_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    if !depositor.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let mut vault_state = VaultState::try_from_slice(&vault_account.data.borrow())?;
    
    // Verify depositor has sufficient funds in vault
    let deposit_index = vault_state.deposits.iter().position(|d| {
        d.depositor == *depositor.key && d.amount >= amount
    }).ok_or(ProgramError::InvalidArgument)?;

    // Calculate refund amount (98% of deposit, 2% fee)
    let fee = amount * 2 / 100;
    let refund_amount = amount - fee;

    // Transfer funds from vault to depositor
    let (vault_authority, _bump_seed) = Pubkey::find_program_address(
        &[b"vault"],
        program_id,
    );

    invoke_signed(
        &system_instruction::transfer(
            vault_account.key,
            depositor.key,
            refund_amount,
        ),
        &[vault_account.clone(), depositor.clone(), system_program.clone()],
        &[&[b"vault", &[_bump_seed]]],
    )?;

    // Update vault state
    vault_state.deposits[deposit_index].amount -= amount;
    vault_state.total_deposits -= amount;
    
    vault_state.serialize(&mut &mut vault_account.data.borrow_mut()[..])?;
    
    msg!("Refund successful: {} lamports (fee: {} lamports)", refund_amount, fee);
    Ok(())
}
