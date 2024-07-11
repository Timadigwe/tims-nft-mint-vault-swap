import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TimsNftMintVaultSwap } from "../target/types/tims_nft_mint_vault_swap";
import { Metaplex } from "@metaplex-foundation/js";
import * as spl from "@solana/spl-token";
import { assert } from "chai";

describe("tims-nft-mint-vault-swap", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TimsNftMintVaultSwap as Program<TimsNftMintVaultSwap>;

  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const metaplex = Metaplex.make(connection);


   // Constants from our program
   const MINT_SEED = "Collection";

  const testMetadata = {
    uri: "https://arweave.net/h19GMcMz7RLDY7kAHGWeWolHTmO83mLLMNPzEkF32BQ",
    name: "NAME",
    symbol: "SYMBOL",
  };

  const [collectionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(MINT_SEED)],
    program.programId
  );

  it("create collection nft", async () => {
    
    const collectionMetadataPDA =  metaplex
    .nfts()
    .pdas()
    .metadata({ mint: collectionPDA });

  const collectionMasterEditionPDA =  metaplex
    .nfts()
    .pdas()
    .masterEdition({ mint: collectionPDA });

    const collectionTokenAccount = await spl.getAssociatedTokenAddress(
      collectionPDA,
      wallet.publicKey
    );

    const modifyComputeUnits =
    anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
      units: 300_000,
    });

    const tx = await program.methods
    .createCollectionNft(
      testMetadata.uri,
      testMetadata.name,
      testMetadata.symbol
    )
    .accounts({
      authority: wallet.publicKey,
      collectionMint: collectionPDA,
      metadataAccount: collectionMetadataPDA,
      masterEdition: collectionMasterEditionPDA,
      tokenAccount: collectionTokenAccount,
    })
    .transaction();

    const transferTransaction = new anchor.web3.Transaction().add(
      modifyComputeUnits,
      tx
    );

    const txSig = await anchor.web3.sendAndConfirmTransaction(
      connection,
      transferTransaction,
      [wallet.payer],
      { skipPreflight: true }
    );

     const accInfo = await connection.getAccountInfo(collectionMetadataPDA);
     assert(accInfo, "  Mint should be initialized.")

  });

 

});
