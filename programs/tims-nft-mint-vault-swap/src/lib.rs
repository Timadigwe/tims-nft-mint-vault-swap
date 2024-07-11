use anchor_lang::prelude::*;

declare_id!("AcCtXFHvc1to5wHeFX2EPj4XE3tDb5Cvcd5YARAcU6eM");

#[program]
pub mod tims_nft_mint_vault_swap {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
