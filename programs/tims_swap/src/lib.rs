use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;

pub use constants::*;
pub use instructions::*;

declare_id!("7svwjVA2mXBsCDL6SSdYonvswsEnx4y3uZGVtjqyeQzq");

#[program]
pub mod tims_swap {
    use super::*;

    /// Swap Tokens for NFTs
    pub fn swap(ctx: Context<SwapContext>) -> Result<()> {
        SwapContext::swap(ctx)
    }

}

