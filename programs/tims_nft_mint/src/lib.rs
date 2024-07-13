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
    pub fn init(ctx: Context<InitContext>) -> Result<()> {
        InitContext::init(ctx)
    }

     /// Create a MPL Core collection 
    pub fn create_collection(
        ctx: Context<CreateCollectionContext>,
        params: CreateCollectionParams,
    ) -> Result<()> {
        CreateCollectionContext::create_collection(ctx, params)
    }

     /// Create a MPL Core asset from a collection
    pub fn mint_asset(ctx: Context<MintFromCollectionContext>, params: MintFromColParams) -> Result<()> {
        MintFromCollectionContext::mint_from_collection(ctx, params)
    }

     /// Lock asset in vault
     pub fn lock_in_vault(ctx: Context<LockAssetInVaultContext>) -> Result<()> {
        LockAssetInVaultContext::lock_asset_in_vault(ctx)
    }
    /// Purchase an asset 
    pub fn purchase(ctx: Context<PurchaseContext>) -> Result<()> {
        PurchaseContext::purchase_asset(ctx)
    }

}

