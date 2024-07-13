use anchor_lang::prelude::*;

#[account]
pub struct CollectionData {
    /// PDA bump
    pub bump: u8,

    /// no. of items that have yet to be minted from collection
    pub items_available: u32,

    /// asset owner
    pub authority: Pubkey,

    /// collection address
    pub collection: Pubkey,

    ///  Unused reserved byte space for additive future changes.
    pub _reserved: [u8; 64],
}

impl CollectionData {
    pub const LEN: usize = 8 // anchor discriminator 
    + 1 // bump 
    + 4 // items available
    + 32 // authority 
    + 32 // collection
    + 64; // reserved

    /// instantiate the bid data account with provided args
    pub fn new(bump: u8, items_available: u32, authority: Pubkey, collection: Pubkey) -> Self {
        Self {
            bump,
            items_available,
            authority,
            collection,
            _reserved: [0; 64],
        }
    }
}


#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateCollectionParams {
    ///  name of our collection
    pub name: String,

    ///  off-chain metadata uri
    pub uri: String,

    /// no. of items collection should hold
    pub items: u32,
}


#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MintFromColParams {
    ///  name of our asset
    pub name: String,

    ///  off-chain metadata uri
    pub uri: String,
}


#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct LockInVaultParams {
    ///  name of our asset
    pub name: String,

    ///  off-chain metadata uri
    pub uri: String,
}