// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import type NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
// import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
// import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, getAccount, } from '@solana/spl-token';
// import { TimsNftMintVaultSwap } from "../target/types/tims_nft_mint_vault_swap";
// import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js';
// import { createDynamicMetadata } from "./metadata-creator";


// describe("tims-nft-mint-vault-swap", () => {
//   // Configure the client to use the local cluster.
//   const provider = anchor.AnchorProvider.env();
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.TimsNftMintVaultSwap as Program<TimsNftMintVaultSwap>;

//   const wallet = provider.wallet as NodeWallet;

//   const SOL_FUNDS_RECEIPIENT = new anchor.web3.PublicKey('AQkkBbppjLG5bLJZjXcXNBDrX48VHp12gwBEE7seaWsm')

//   const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

//   const mintAuthority = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('authority')], program.programId)[0];


//   const collectionKeypair = Keypair.generate();
//   const collectionMint = collectionKeypair.publicKey;

//   const mintKeypair = Keypair.generate();
//   const mint = mintKeypair.publicKey;



//   const getMetadata = async (mint: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
//     return anchor.web3.PublicKey.findProgramAddressSync(
//       [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
//       TOKEN_METADATA_PROGRAM_ID,
//     )[0];
//   };

//   const getMasterEdition = async (mint: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
//     return anchor.web3.PublicKey.findProgramAddressSync(
//       [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition')],
//       TOKEN_METADATA_PROGRAM_ID,
//     )[0];
//   };

//   const [vaultOwner] = anchor.web3.PublicKey.findProgramAddressSync(
//     [Buffer.from("vault_owner")],
//     program.programId
//   );

//   const [vaultAccount] = anchor.web3.PublicKey.findProgramAddressSync(
//     [Buffer.from("vault")],
//     program.programId
//   );



//   // const testMetadata = {
//   //   uri: "https://arweave.net/h19GMcMz7RLDY7kAHGWeWolHTmO83mLLMNPzEkF32BQ",
//   //   name: "NAME",
//   //   symbol: "SYMBOL",
//   //   decimal: 0
//   // };

//   const imagePath = 'https://www.google.com/imgres?q=nft%20images&imgurl=https%3A%2F%2Fmedia.architecturaldigest.com%2Fphotos%2F61d32b267a58c403a95c550d%2Fmaster%2Fw_1600%252Cc_limit%2FLot%2525209_It%252520Must%252520Have%252520Been%252520the%252520Clams%252520(Chair).jpg&imgrefurl=https%3A%2F%2Fwww.architecturaldigest.com%2Fstory%2Feverything-designers-actually-need-to-know-about-the-weird-wild-world-of-nfts&docid=lO01RoxRzcrhMM&tbnid=QczzhTvlIiSqiM&vet=12ahUKEwjp4diwg6OHAxVQQUEAHUBhCakQM3oECEYQAA..i&w=1600&h=2133&hcb=2&ved=2ahUKEwjp4diwg6OHAxVQQUEAHUBhCakQM3oECEYQAA';
//   const name = 'TimsBoredNFT';
//   const symbol = 'TBNFT';
//   const decimal = 0;


//   const mintAmount = 1;

//   it('Create Collection NFT', async () => {
//     console.log('\nCollection Mint Key: ', collectionMint.toBase58());

//     const metadata = await getMetadata(collectionMint);
//     console.log('Collection Metadata Account: ', metadata.toBase58());

//     const masterEdition = await getMasterEdition(collectionMint);
//     console.log('Master Edition Account: ', masterEdition.toBase58());

//     const destination = getAssociatedTokenAddressSync(collectionMint, wallet.publicKey);
//     console.log('Destination ATA = ', destination.toBase58());

//     const testMetadata = await createDynamicMetadata(imagePath, name, symbol, decimal);
//     console.log('Metadata:', testMetadata);


//     const tx = await program.methods
//       .createCollection(
//         testMetadata.metadataUri,
//         testMetadata.name,
//         testMetadata.symbol,
//         testMetadata.decimal
//       )
//       .accountsPartial({
//         user: wallet.publicKey,
//         mint: collectionMint,
//         mintAuthority,
//         metadata,
//         masterEdition,
//         destination,
//         systemProgram: SystemProgram.programId,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//         tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
//       })
//       .signers([collectionKeypair])
//       .rpc({
//         skipPreflight: true,
//       });
//     console.log('\nCollection NFT minted: TxID - ', tx);
//   });

//   it('Mint NFT', async () => {
//     console.log('\nMint', mint.toBase58());

//     const metadata = await getMetadata(mint);
//     console.log('Metadata', metadata.toBase58());

//     const masterEdition = await getMasterEdition(mint);
//     console.log('Master Edition', masterEdition.toBase58());

//     const destination = getAssociatedTokenAddressSync(mint, wallet.publicKey);
//     console.log('Destination', destination.toBase58());

//     const testMetadata = await createDynamicMetadata(imagePath, name, symbol, decimal);
//     console.log('Metadata:', testMetadata);

//     const tx = await program.methods
//       .mintNft(
//         testMetadata.metadataUri,
//         testMetadata.name,
//         testMetadata.symbol,
//         testMetadata.decimal,
//         new anchor.BN(mintAmount)
//       )
//       .accountsPartial({
//         owner: wallet.publicKey,
//         destination,
//         metadata,
//         masterEdition,
//         mint,
//         mintAuthority,
//         collectionMint,
//         systemProgram: SystemProgram.programId,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
//         tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
//       })
//       .signers([mintKeypair])
//       .rpc({
//         skipPreflight: true,
//       });
//     console.log('\nNFT Minted! Your transaction signature', tx);
//   });

//   it('Verify Collection', async () => {
//     const mintMetadata = await getMetadata(mint);
//     console.log('\nMint Metadata', mintMetadata.toBase58());

//     const collectionMetadata = await getMetadata(collectionMint);
//     console.log('Collection Metadata', collectionMetadata.toBase58());

//     const collectionMasterEdition = await getMasterEdition(collectionMint);
//     console.log('Collection Master Edition', collectionMasterEdition.toBase58());

//     const tx = await program.methods
//       .verifyCollection()
//       .accountsPartial({
//         authority: wallet.publicKey,
//         metadata: mintMetadata,
//         mint,
//         mintAuthority,
//         collectionMint,
//         collectionMetadata,
//         collectionMasterEdition,
//         systemProgram: SystemProgram.programId,
//         sysvarInstruction: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
//         tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
//       })
//       .rpc({
//         skipPreflight: true,
//       });
//     console.log('\nCollection Verified! Your transaction signature', tx);
//   });
 

// it('Swaps sol for nft', async () => {
    
//     const mintKeypair = Keypair.generate();
//     const mint = mintKeypair.publicKey;
//     console.log('\nMint', mint.toBase58());

//     const metadata = await getMetadata(mint);
//     console.log('Metadata', metadata.toBase58());

//     const masterEdition = await getMasterEdition(mint);
//     console.log('Master Edition', masterEdition.toBase58());

//     const destination = getAssociatedTokenAddressSync(mint, wallet.publicKey);
//     console.log('Destination', destination.toBase58());

//     const testMetadata = await createDynamicMetadata(imagePath, name, symbol, decimal);
//     console.log('Metadata:', testMetadata);

//     const tx = await program.methods
//       .swapSolForNft(
//         testMetadata.metadataUri,
//         testMetadata.name,
//         testMetadata.symbol,
//         testMetadata.decimal,
//         new anchor.BN(mintAmount)
//       )
//       .accountsPartial({
//         owner: wallet.publicKey,
//         destination,
//         solRecipient: SOL_FUNDS_RECEIPIENT,
//         metadata,
//         masterEdition,
//         mint,
//         mintAuthority,
//         collectionMint,
//         systemProgram: SystemProgram.programId,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
//         tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
//       })
//       .signers([mintKeypair])
//       .rpc({
//         skipPreflight: true,
//       });
//     console.log('\nNFT Minted! Your transaction signature', tx);
//     const balance = await provider.connection.getBalance(SOL_FUNDS_RECEIPIENT);
//   console.log(
//     "SOL_FUNDS_RECEIPIENT balance after tx " + balance / LAMPORTS_PER_SOL
//   );
//   });

//   it('Locks an nft in a vault', async () => {
//     console.log('\nMint', mint.toBase58());

//     const nftMintATA = getAssociatedTokenAddressSync(mint, wallet.publicKey);
//     console.log('Nft mint ATA', nftMintATA.toBase58());


//     const tx = await program.methods.lockNft(new anchor.BN(mintAmount)).accountsPartial({
//     user: wallet.publicKey,
//     vaultOwner: vaultOwner,
//     vaultAccount: vaultAccount,
//     senderNftAccount: nftMintATA,
//     mintOfNftBeingSent: mint,
//     systemProgram: SystemProgram.programId,
//     tokenProgram: TOKEN_PROGRAM_ID,
//     })
//     .rpc({
//       skipPreflight: true,
//     });
//   console.log('\nNFT locked! Your transaction signature', tx);
//   const tokenAccountInfo = await getAccount(program.provider.connection, vaultAccount);
//   console.log(
//     "Vault token amount after: " + tokenAccountInfo.amount 
//   );
//   })

//   it('Withdraws an nft from a vault', async () => {
//     console.log('\nMint', mint.toBase58());

//     const nftMintATA = getAssociatedTokenAddressSync(mint, wallet.publicKey);
//     console.log('Nft mint ATA', nftMintATA.toBase58());
//     const nativeSolAddress = new anchor.web3.PublicKey('So11111111111111111111111111111111111111112');

//     const tx = await program.methods.withdrawNft().accountsPartial({
//     user: wallet.publicKey,
//     vaultOwner: vaultOwner,
//     vaultAccount: vaultAccount,
//     rentReceiver: nativeSolAddress,
//     senderNftAccount: nftMintATA,
//     mintOfNftBeingSent: mint,
//     systemProgram: SystemProgram.programId,
//     tokenProgram: TOKEN_PROGRAM_ID,
//     })
//     .rpc({
//       skipPreflight: true,
//     });
//   console.log('\nNFT locked! Your transaction signature', tx);
//   const tokenAccountInfo = await getAccount(program.provider.connection, vaultAccount);
//   console.log(
//     "Vault token amount after: " + tokenAccountInfo.amount 
//   );

//   })



// });

