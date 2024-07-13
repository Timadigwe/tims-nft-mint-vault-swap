use anchor_lang::{prelude::*, solana_program::system_instruction};
use anchor_spl::{
    associated_token::AssociatedToken, 
    metadata::Metadata, 
    token::{
        mint_to,
        Mint, 
        MintTo, 
        Token, 
        TokenAccount
    }
};
use anchor_spl::metadata::mpl_token_metadata::{
    instructions::{
        CreateMasterEditionV3Cpi, 
        CreateMasterEditionV3CpiAccounts, 
        CreateMasterEditionV3InstructionArgs, 
        CreateMetadataAccountV3Cpi, 
        CreateMetadataAccountV3CpiAccounts, 
        CreateMetadataAccountV3InstructionArgs,
    }, 
    types::{
        Collection, 
        Creator, 
        DataV2,
    }
};
use crate::{constants::{AUTHORITY_SEED, SOL_SWAP_AMOUNT}, errors::GeneralError, state::CreateNFTParams};

#[derive(Accounts)]
#[instruction(params: CreateNFTParams)]
pub struct SwapSolForNft<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        mint::decimals = params.decimals,
        mint::authority = mint_authority,
        mint::freeze_authority = mint_authority,
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = owner
    )]
    pub destination: Account<'info, TokenAccount>,

    /// CHECK: We aren't writing to it 
    #[account(mut)]
    pub sol_recipient: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: This account will be initialized by the metaplex program
    pub metadata: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: This account will be initialized by the metaplex program
    pub master_edition: UncheckedAccount<'info>,
    #[account(
        seeds = [AUTHORITY_SEED],
        bump,
    )]
    /// CHECK: This is account is not initialized and is being used for signing purposes only
    pub mint_authority: UncheckedAccount<'info>,
    #[account(mut)]
    pub collection_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: Program<'info, Metadata>,
}


impl<'info> SwapSolForNft<'info> {
    pub fn swap_sol_for_nft(&mut self, bumps: &SwapSolForNftBumps,
        uri: String,
        name: String,
        symbol: String,
        quantity: u64) -> Result<()> {
            // if the users sol balance is greater than the swap amount we go on and transfer sol
            let user_balance: u64 = self.owner.to_account_info().lamports();
            require_gt!(user_balance, SOL_SWAP_AMOUNT, GeneralError::InvalidFee);

            let sender_account = &self.owner.to_account_info();
            let recipient_account = &self.sol_recipient.to_account_info();

             // Create the transfer instruction
        let transfer_instruction =
        system_instruction::transfer(sender_account.key, recipient_account.key, SOL_SWAP_AMOUNT);


            // Invoke the transfer instruction
        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                        sender_account.to_account_info(),
                        recipient_account.clone(),
                        self.system_program.to_account_info(),
                        ],
                   &[],
                )?;

          // then mint the nft to the user
        let metadata = &self.metadata.to_account_info();
        let master_edition = &self.master_edition.to_account_info();
        let mint = &self.mint.to_account_info();
        let authority = &self.mint_authority.to_account_info();
        let payer = &self.owner.to_account_info();
        let system_program = &self.system_program.to_account_info();
        let spl_token_program = &self.token_program.to_account_info();
        let spl_metadata_program = &self.token_metadata_program.to_account_info();

        let seeds = &[
            &AUTHORITY_SEED[..], 
            &[bumps.mint_authority]
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = MintTo {
            mint: self.mint.to_account_info(),
            to: self.destination.to_account_info(),
            authority: self.mint_authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        mint_to(cpi_ctx, quantity)?;
        msg!("Collection NFT minted!");

        let creator = vec![
            Creator {
                address: self.mint_authority.key(),
                verified: true,
                share: 100,
            },
        ];

        let metadata_account = CreateMetadataAccountV3Cpi::new(
            spl_metadata_program,
            CreateMetadataAccountV3CpiAccounts {
                metadata,
                mint,
                mint_authority: authority,
                payer,
                update_authority: (authority, true),
                system_program,
                rent: None,
            }, 
            CreateMetadataAccountV3InstructionArgs {
                data: DataV2 {
                    name,
                    symbol,
                    uri,
                    seller_fee_basis_points: 0,
                    creators: Some(creator),
                    collection: Some(Collection {
                        verified: false,
                        key: self.collection_mint.key(),
                    }),
                    uses: None
                },
                is_mutable: true,
                collection_details: None,
            }
        );
        metadata_account.invoke_signed(signer_seeds)?;

        let master_edition_account = CreateMasterEditionV3Cpi::new(
            spl_metadata_program,
            CreateMasterEditionV3CpiAccounts {
                edition: master_edition,
                update_authority: authority,
                mint_authority: authority,
                mint,
                payer,
                metadata,
                token_program: spl_token_program,
                system_program,
                rent: None,
            },
            CreateMasterEditionV3InstructionArgs {
                max_supply: Some(0),
            }
        );
        master_edition_account.invoke_signed(signer_seeds)?;

        Ok(())
        
    }
}