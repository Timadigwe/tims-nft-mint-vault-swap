use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("7B7qYnQAV8SfuxsnkXeWm63H8vYwuKxmWX55avBARUCL");

#[derive(Clone)]
pub struct Core;

impl anchor_lang::Id for Core {
    fn id() -> Pubkey {
        mpl_core::ID
    }
}

#[program]
pub mod tims_nft_mint {
    use super::*;

    /// Init protocol config and accounts
    ///
    pub fn init(ctx: Context<Init>) -> Result<()> {
        Init::init(ctx)
    }

     /// Create a MPL Core collection
    ///
    pub fn create_collection(
        ctx: Context<CreateCollection>,
        params: CreateCollectionParams,
    ) -> Result<()> {
        CreateCollection::create_collection(ctx, params)
    }

     /// Create a MPL Core asset from a collection
    ///
    pub fn mint_asset(ctx: Context<MintFromCollection>, params: MintFromColParams) -> Result<()> {
        MintFromCollection::mint_from_collection(ctx, params)
    }

     // lock asset in vault
     pub fn lock_in_vault(ctx: Context<LockAssetInVault>) -> Result<()> {
        LockAssetInVault::lock_asset_in_vault(ctx)
    }

    pub fn purchase(ctx: Context<Purchase>) -> Result<()> {
        Purchase::purchase_asset(ctx)
    }

}

