use anchor_lang::{prelude::*, solana_program::native_token::LAMPORTS_PER_SOL};

#[constant]
pub const AUTHORITY_SEED: &[u8] = b"authority";

#[constant]
pub const VAULT_OWNER: &[u8] = b"vault_owner";


#[constant]
pub const VAULT: &[u8] = b"vault";

#[constant]
pub const SOL_SWAP_AMOUNT: u64 = 200 * LAMPORTS_PER_SOL;