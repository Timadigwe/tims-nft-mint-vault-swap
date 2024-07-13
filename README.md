# 

## TIMS-NFT-MINT-VAULT-SWAP

Creating Metaplex Core Core Collections and assets, storing them in a vault, and facilitating their easy conversion into SOL are all made possible by this project's optimized approach.
With "tims_nft_mint" program, Metaplex Core Collections and assets are created and managed automatically.
To mint collections and individual assets inside the Metaplex Core standard, we makes use of this specialized programs. Also, the "tim_nft_mint" program is used to secure the minted NFTs inside a vault.
The "tims_swap" program  lets users trade in their vaulted Collections for SOL, the native token of Solana. 


## Running on Solana Localnet

```bash
# solana-cli 1.18.8

avm use 0.30.1
# anchor-cli 0.30.1
```

```bash
solana-test-validator

solana config set --url http://127.0.0.1:8899
```

Build Project

1. Install required yarn dependencies

```bash
yarn install
```

2. Build the project to generate types, idl and deployable sbf program

```bash
anchor build
```

3. The project contains two test

-  [test-nft-mint-vault tests](./tests/test-nft-mint-vault.ts) which mint the asset and lock the asset in the program vault
-  [test-swap tests](./tests/test-swap.ts) for swapping the assets to SOL



## Instructions and Contexts


1. **Tims_Nft_Mint program**

-   **`init` - **only call this if you deploy a new program**. Starts the program by setting up its communication rules (protocol state) and accounts for managing digital resources (asset manager accounts).**

**Accounts:**

1. [writable, signer] payer
2. [writable] assetManager
3. [writable] protocol
4. [writable] treasury
5. [] core program
6. [] system program


-   **`create_collection` - creates a collection for the assets that will be minted**

**Accounts:**

1. [writable, signer] payer
2. [writable, signer] collection
3. [writable] collection_data
4. [] core program
5. [] system program

**Parameters**:
-params: [CreateCollectionParams]

-   **`mint_asset` - mints asset from previously created collection**

**Accounts:**

1. [writable, signer] payer
2. [writable, signer] asset
3. [writable] collection
4. [writable] collection_data
5. [] core program
6. [] system program

**Parameters**:
-params: [MintFromColParams]

-   **`lock_in_vault` - locks an asset in the program vault. Protocol takes a flat fee of 1 SOl for locking the asset**

**Accounts:**

1. [writable, signer] payer
2. [writable] asset
3. [writable] collection
4. [writable] asset manager
5. [writable] protocol
6. [] core program
7. [] system program

-   **`purchase` - Unlock and acquire an asset from a program vault for a one-time fee of 2 SOL.**

**Accounts:**

1. [writable, signer] payer
2. [writable] buyer
3. [writable] previous_owner
4. [writable] asset
5. [writable] collection
6. [] asset manager
7. [] protocol
8. [] core program
9. [] system program


2. **Tims_Swap program**

-   **swap. The user initiates a swap by transferring their CPI tokens into the mint-vault program. This program then calls the purchase IX function to exchange a locked asset within the vault for SOL.**

**Accounts:**

1. [writable, signer] payer
2. [writable] buyer
3. [writable] previous_owner
4. [writable] asset
5. [writable] collection
6. [] asset manager
7. [] protocol
8. [] core program
9. [] mint_vault_program
10.[] system program


## Links

- [YouTube Tutorial](https://youtu.be/wl4GtInUaZ8)