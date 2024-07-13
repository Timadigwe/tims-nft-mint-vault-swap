use anchor_lang::prelude::*;

#[error_code]
pub enum GeneralError {
    #[msg("The address is not the owner of the vault")]
    InvalidOwner,

    #[msg("Invalid fee value for nft swap")]
    InvalidFee,

    #[msg("Invariant does not hold")]
    InvariantViolated,
}