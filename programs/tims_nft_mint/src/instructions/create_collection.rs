use anchor_lang::{prelude::*, solana_program::native_token::LAMPORTS_PER_SOL};
use mpl_core::instructions::CreateCollectionV1CpiBuilder;

use crate::{
    constants::{SEED_COLLECTION_DATA, SEED_PREFIX}, error::CreateErrorCode, state::CollectionData, AssetManager, Core, CreateCollectionParams, Protocol, ADMIN_ADDRESS, SEED_ASSET_MANAGER, SEED_PROTOCOL
};


/// Create MPL Core collection and Initialize AssetManager escrow and Protocol account
///
/// ### Accounts:
///
/// 1. `[writable, signer]` payer
/// 2. `[writable,]` assetManager
/// 3. `[writable]` protocol
/// 4. `[writable, signer]` collection
/// 5. `[writable]` collection_data
/// 6. `[writable]` treasury
/// 7. `[]` core program
/// 8. `[]` `system program`
///
/// ### Parameters
///
/// 1. params: [CreateCollectionParams]
///
#[derive(Accounts)]
#[instruction(params: CreateCollectionParams)]
pub struct CreateCollectionContext<'info> {
    #[account(mut, address = ADMIN_ADDRESS @CreateErrorCode::PubkeyMismatch)]
    pub payer: Signer<'info>,

    #[account(
        init, 
        payer=payer,
        space=AssetManager::LEN,
        seeds = [SEED_PREFIX, SEED_ASSET_MANAGER],
        bump
    )]
    pub asset_manager: Account<'info, AssetManager>,

    #[account(
        init, 
        payer=payer,
        space=Protocol::LEN,
        seeds = [SEED_PREFIX, SEED_PROTOCOL],
        bump
    )]
    pub protocol: Account<'info, Protocol>,

    /// CHECK: This is safe since we are passing this in ourselves
    #[account(mut, signer)]
    pub collection: UncheckedAccount<'info>,

    #[account(
        init,
        payer = payer,
        space = CollectionData::LEN,
        seeds = [SEED_PREFIX, SEED_COLLECTION_DATA, collection.key().as_ref()],
        bump
    )]
    pub collection_data: Account<'info, CollectionData>,

    pub treasury: SystemAccount<'info>,

    pub core_program: Program<'info, Core>,

    pub system_program: Program<'info, System>,
}

impl CreateCollectionContext<'_> {
    /// validation helper for our IX
    pub fn validate(&self) -> Result<()> {
        return Ok(());
    }

    /// Mint a collection asset.
    ///
    #[access_control(ctx.accounts.validate())]
    pub fn create_collection(
        ctx: Context<CreateCollectionContext>,
        params: CreateCollectionParams,
    ) -> Result<()> {

        // We first of all initialize the Asset Manager escrow account

        let asset_manager = &mut ctx.accounts.asset_manager;
        asset_manager.bump = ctx.bumps.asset_manager; 

        let protocol = &mut ctx.accounts.protocol;
        protocol.treasury = ctx.accounts.treasury.key();
        protocol.rent = 1 * LAMPORTS_PER_SOL; // ! fixed rental fees


        // update our collection data
        let collection_data = &mut ctx.accounts.collection_data;

        **collection_data = CollectionData::new(
            ctx.bumps.collection_data,
            params.items,
            ctx.accounts.payer.key(),
            ctx.accounts.collection.key(),
        );

        //CPI into mpl_core program and create collection
        CreateCollectionV1CpiBuilder::new(&ctx.accounts.core_program)
            .collection(&ctx.accounts.collection)
            .payer(&ctx.accounts.payer)
            .update_authority(Some(&ctx.accounts.payer))
            .system_program(&ctx.accounts.system_program)
            .name(params.name)
            .uri(params.uri)
            .invoke()?;

        Ok(())
    }
}
