use anchor_lang::prelude::*;
use anchor_spl::
    token::{ Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct LockNft<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"vault_owner"],
        bump,
        space = 8 + 32 ,
    )]
    pub vault_owner: Account<'info, Vault>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"vault"],
        token::mint = mint_of_nft_being_sent,
        token::authority = vault_owner,
        bump
    )]
    vault_account: Account<'info, TokenAccount>,

    #[account(mut)]
    sender_nft_account: Account<'info, TokenAccount>,

    mint_of_nft_being_sent: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Vault {
    pub authority: Pubkey,
}


impl<'info> LockNft<'info> {
    pub fn lock_nft(&mut self, amount: u64)  -> Result<()> {
        //set the owner of the vault to the user
        self.vault_owner.authority = self.user.key();

        //perform the nft transfer 
       let transfer_ix = Transfer {
        from: self.sender_nft_account.to_account_info(),
        to:self.vault_account.to_account_info(),
        authority: self.user.to_account_info()
       };
       let cpi_ctx = CpiContext::new(
        self.token_program.to_account_info(),
        transfer_ix,
    );
    anchor_spl::token::transfer(cpi_ctx, amount)?;
        Ok(())
    }
}



#[derive(Accounts)]
pub struct WithdrawNFT<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        close = rent_receiver,
        seeds = [b"vault_owner"],
        bump,
    )]
    pub vault_owner: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]
    vault_account: Account<'info, TokenAccount>,

    /// CHECK:  This is the protocol address passed to receive the rent 
    #[account(mut)]
    rent_receiver: AccountInfo<'info>,

    #[account(mut)]
    sender_nft_account: Account<'info, TokenAccount>,

    mint_of_nft_being_sent: Account<'info, Mint>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}


impl<'info> WithdrawNFT<'info> {
    pub fn withdraw_nft(&mut self, bumps: &WithdrawNFTBumps)  -> Result<()> {
        let user = self.user.key();
        let authority = self.vault_owner.authority.key();
        require_eq!(
            user,
            authority,
            ErrorCode::InvalidOwner
        );
       let bump = bumps.vault_owner;
       let seeds = &[b"vault_owner".as_ref(), &[bump]];
        let signer_seeds = &[&seeds[..]];

         //perform the nft transfer 
       let transfer_ix = Transfer {
        from: self.vault_account.to_account_info(),
        to:self.sender_nft_account.to_account_info(),
        authority: self.vault_owner.to_account_info()
       };

       let cpi_ctx = CpiContext::new_with_signer(
        self.token_program.to_account_info(),
        transfer_ix,
        signer_seeds,
    );

    anchor_spl::token::transfer(cpi_ctx, self.vault_account.amount)?;
        Ok(())
    }
}


// #[derive(Accounts)]
// pub struct UnLockNft<'info> {
//     #[account(mut)]
//     pub user: Signer<'info>,
//     #[account(
//         mut,
//         close = receiver,
//         seeds = [b"vault_owner"],
//         bump,
//     )]
//     pub vault_owner: Account<'info, Vault>,    
//     #[account(
//         mut,
//         //close = user,
//         seeds = [b"vault"],
//         bump
//     )]
//     vault_account: Account<'info, TokenAccount>,
//     /// CHECK:  lets just see if it works
//     #[account(mut)]
//     receiver: AccountInfo<'info>,
//     pub rent: Sysvar<'info, Rent>,
//     pub system_program: Program<'info, System>,
//     pub token_program: Program<'info, Token>,
// }


// impl<'info> UnLockNft<'info> {
//     pub fn unlock_nft(&mut self)  -> Result<()> { 
//         Ok(())
//     }
//  }


#[error_code]
pub enum ErrorCode {
    #[msg("The address is not the owner of the vault")]
    InvalidOwner,
}