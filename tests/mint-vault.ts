import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { createGenericFile, generateSigner, keypairIdentity,signerIdentity,sol } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { bundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr";
import { nftStorageUploader } from "@metaplex-foundation/umi-uploader-nft-storage";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { TimsNftMint } from "../target/types/tims_nft_mint";
import {
	CORE_PROGRAM_ID,
	findAssetManagerAddress,
	findCollectionDataAddress,
	findProtocolAddress,
	NFT_STORAGE_TOKEN,
	requestAirdrop,
	txConfig,
	uint8FileData,
	uploadAssetFiles,
	userKeypair,
} from "./utils";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';


describe("mint-vault", () => {
	// Configure the client to use the local solana config env.
	const provider = anchor.AnchorProvider.env();
	anchor.setProvider(provider);	

	// instantiate umi
	const umi = createUmi(provider.connection).use(mplCore());
	const payer = generateSigner(umi);
	//const keypair = umi.eddsa.createKeypairFromSecretKey(userKeypair.secretKey);
	//umi.use(keypairIdentity(keypair)).use(bundlrUploader());
	umi.use(signerIdentity(payer));
	umi.use(mockStorage())
	umi.rpc.airdrop(umi.identity.publicKey, sol(1000), txConfig.confirm)

	const program = anchor.workspace.TimsNftMint as Program<TimsNftMint>;
	//console.log(program)

	it("Is initialized protocol state!", async () => {
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

	it("Is Creates Collection!", async () => {
		const collection = Keypair.generate();

		await requestAirdrop(userKeypair.publicKey, 100, provider.connection);
		console.log('Airdrop completed, you can proceed with your tests.');

		console.log("-- uploading assets")
		let name = "YMIR Collection";
		let description = "my really awesome YMIR collection";
		let uri = await uploadAssetFiles(umi, name, description);

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

		console.log("collections address", collection.publicKey);
		console.log(
			`tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet\n`
		);
	});

	// it("Is Mints asset from collection!", async () => {
	// 	const asset = Keypair.generate();
	// 	const collection = new PublicKey(
	// 		"EVhj14d1vKAP8ZAdgbkvCYqpcxtVAFYY2Z17sJhbM3k2"
	// 	);

	// 	const rand = Math.floor(Math.random() * 10);
	// 	const name = `YMIR #${rand}`;
	// 	const description = `Asset No. ${rand}`;
	// 	let uri = await uploadAssetFiles(umi, name, description);
	// 	const params = {
	// 		name,
	// 		uri,
	// 	};

	// 	const txHash = await program.methods
	// 		.mintAsset(params)
	// 		.accounts({
	// 			payer: provider.publicKey,
	// 			asset: asset.publicKey,
	// 			collection,
	// 			collectionData: findCollectionDataAddress(collection),
	// 			coreProgram: CORE_PROGRAM_ID,
	// 			systemProgram: SystemProgram.programId,
	// 		})
	// 		.signers([asset])
	// 		.rpc();

	// 	console.log("mint address", asset.publicKey);
	// 	console.log(
	// 		`tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet\n`
	// 	);
	// });

	// it("Lock Asset In Vault!", async () => {
	// 	const asset = new PublicKey(
	// 		"CBMg87CRTWA1qenc7inasnnAQDLL5Tu5n8P7geFkiSkj"
	// 	);
	// 	const collection = new PublicKey(
	// 		"EVhj14d1vKAP8ZAdgbkvCYqpcxtVAFYY2Z17sJhbM3k2"
	// 	);


	// 	const txHash = await program.methods
	// 		.lockInVault()
	// 		.accounts({
	// 			payer: provider.publicKey,
	// 			treasury: provider.publicKey,
	// 			asset,
	// 			collection,
	// 			assetManager: findAssetManagerAddress(),
	// 			protocol: findProtocolAddress(),
	// 			coreProgram: CORE_PROGRAM_ID,
	// 			systemProgram: SystemProgram.programId,
	// 		})
	// 		.rpc();

	// 	console.log(
	// 		`tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet\n`
	// 	);
	// });
});
