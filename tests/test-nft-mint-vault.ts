import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { generateSigner,signerIdentity,sol } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {  SystemProgram } from "@solana/web3.js";
import { TimsNftMint } from "../target/types/tims_nft_mint";
import {
	asset,
	collection,
	CORE_PROGRAM_ID,
	findAssetManagerAddress,
	findCollectionDataAddress,
	findProtocolAddress,
	txConfig,
	uploadAssetFiles,
} from "./utils";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';


describe("tims-nft-mint-vault", () => {
	const provider = anchor.AnchorProvider.env();
	anchor.setProvider(provider);	

	// umi initialization
	const umi = createUmi(provider.connection).use(mplCore());
	const payer = generateSigner(umi);
	umi.use(signerIdentity(payer));
	umi.use(mockStorage())
	umi.rpc.airdrop(umi.identity.publicKey, sol(1000), txConfig.confirm)

	const program = anchor.workspace.TimsNftMint as Program<TimsNftMint>;


	it(" Initializes protocol state", async () => {
		const txHash = await program.methods
			.init()
			.accountsStrict({
				payer: provider.publicKey,
				assetManager: findAssetManagerAddress(),
				protocol: findProtocolAddress(),
				treasury: provider.publicKey,
				coreProgram: CORE_PROGRAM_ID,
				systemProgram: SystemProgram.programId,
			})
			.rpc();

		console.log(
			`tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet\n`
		);
	});


	it("Creates Collection", async () => {
		
		console.log("-- uploading assets")
		let name = "TimBoredApe";
		let description = "Friends of Tim BoredApe Collections";
		let imageUrl = "https://www.freepik.com/free-photos-vectors/nft"
		let uri = await uploadAssetFiles(umi, name, description, imageUrl);

		const createCollectionParams = {
			name,
			uri,
			items: 10,
		};


	console.log("-- sending trasactions")
		const txHash = await program.methods
			.createCollection(createCollectionParams)
			.accountsStrict({
				payer: provider.publicKey,
				collection: collection.publicKey,
				collectionData: findCollectionDataAddress(collection.publicKey),
				coreProgram: CORE_PROGRAM_ID,
				systemProgram: SystemProgram.programId,
			})
			.signers([collection])
			.rpc();

		console.log("collections address", collection.publicKey.toString());
		console.log(
			`tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet\n`
		);
	});

	it(" Mints asset from collection!", async () => {
		const rand = Math.floor(Math.random() * 10);
		const name = `TimBoredApe #${rand}`;
		const description = `Asset No. ${rand}`;
		let imageUrl = "https://www.freepik.com/free-photos-vectors/nft"
		let uri = await uploadAssetFiles(umi, name, description, imageUrl);
		const params = {
			name,
			uri,
		};

		const txHash = await program.methods
			.mintAsset(params)
			.accountsStrict({
				payer: provider.publicKey,
				asset: asset.publicKey,
				collection: collection.publicKey,
				collectionData: findCollectionDataAddress(collection.publicKey),
				coreProgram: CORE_PROGRAM_ID,
				systemProgram: SystemProgram.programId,
			})
			.signers([asset])
			.rpc();

		console.log("mint address", asset.publicKey.toString());
		console.log(
			`tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet\n`
		);
	});

	it("Lock Asset In Vault!", async () => {
		const txHash = await program.methods
			.lockInVault()
			.accountsStrict({
				payer: provider.publicKey,
				treasury: provider.publicKey,
				asset: asset.publicKey,
				collection: collection.publicKey,
				assetManager: findAssetManagerAddress(),
				protocol: findProtocolAddress(),
				coreProgram: CORE_PROGRAM_ID,
				systemProgram: SystemProgram.programId,
			})
			.rpc();

		console.log(
			`tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet\n`
		);
	});
});
