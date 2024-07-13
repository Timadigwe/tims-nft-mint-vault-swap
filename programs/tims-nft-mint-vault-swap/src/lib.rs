use anchor_lang::prelude::*;

pub mod contexts;
mod constants;
mod errors;
mod state;

pub use contexts::*;

declare_id!("AcCtXFHvc1to5wHeFX2EPj4XE3tDb5Cvcd5YARAcU6eM");


#[program]
pub mod tims_nft_mint_vault_swap {

    use super::*;

    pub fn create_collection(ctx: Context<CreateCollection>,
        uri: String,
        name: String,
        symbol: String,
        _decimals: u8) -> Result<()> {
        ctx.accounts.create_collection(&ctx.bumps,uri, name, symbol)
    }
    
    pub fn mint_nft(ctx: Context<MintNFT>,
        uri: String,
        name: String,
        symbol: String,
        _decimals: u8,
        quantity: u64
    ) -> Result<()> {
        ctx.accounts.mint_nft(&ctx.bumps,uri, name, symbol, quantity)
    }

    pub fn verify_collection(ctx: Context<VerifyCollectionMint>) -> Result<()> {
        ctx.accounts.verify_collection(&ctx.bumps)
    }

    pub fn lock_nft(ctx: Context<LockNft>, amount: u64) -> Result<()> {
        ctx.accounts.lock_nft(amount)
    }

    pub fn withdraw_nft(ctx: Context<WithdrawNFT>) -> Result<()> {
        ctx.accounts.withdraw_nft(&ctx.bumps)
    }


   
    pub fn swap_sol_for_nft(ctx: Context<SwapSolForNft>,
        uri: String,
        name: String,
        symbol: String,
        _decimals: u8,
        quantity: u64
    ) -> Result<()> {
        ctx.accounts.swap_sol_for_nft(&ctx.bumps,uri, name, symbol, quantity)
    }
    
}

