import { createGenericFile, TransactionBuilderSendAndConfirmOptions, Umi } from "@metaplex-foundation/umi";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import dotenv from "dotenv";
import fs, { readFileSync } from "fs";
import { homedir } from "os";
import path from "path";

dotenv.config();

// ------------------------------------------- seeds

export const SEED_PREFIX = "anchor";

export const ASSET_MANAGER_PREFIX = "asset manager";

export const SEED_COLLECTION_DATA = "collection";

export const SEED_PROTOCOL = "protocol";

// ------------------------------------ config
export const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_TOKEN;

// ---------------------------------------- programs

export const MINT_VAULT_ID = new PublicKey(
	"7B7qYnQAV8SfuxsnkXeWm63H8vYwuKxmWX55avBARUCL"
);

export const SWAP = new PublicKey(
	"xnrMV3UCFqDefZW3oEY4QGVX8fFmopJGETwWDSfCiUd"
);

export const CORE_PROGRAM_ID = new PublicKey(
	"CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

// ----------------------------------------- PDAs

export const findAssetManagerAddress = (): PublicKey => {
	return PublicKey.findProgramAddressSync(
		[Buffer.from(SEED_PREFIX), Buffer.from(ASSET_MANAGER_PREFIX)],
		MINT_VAULT_ID
	)[0];
};

export const findProtocolAddress = (): PublicKey => {
	return PublicKey.findProgramAddressSync(
		[Buffer.from(SEED_PREFIX), Buffer.from(SEED_PROTOCOL)],
		MINT_VAULT_ID
	)[0];
};

export const findCollectionDataAddress = (collection: PublicKey): PublicKey => {
	return PublicKey.findProgramAddressSync(
		[
			Buffer.from(SEED_PREFIX),
			Buffer.from(SEED_COLLECTION_DATA),
			collection.toBuffer(),
		],
		MINT_VAULT_ID
	)[0];
};

// ------------------------------- helpers
export function uint8FileData(pathName: string): Uint8Array {
	const filePath = path.join(__dirname, pathName);

	const data = fs.readFileSync(filePath);
	return data;
}

const USER_KEYPAIR_PATH = homedir() + "/.config/solana/id.json";
export const userKeypair = Keypair.fromSecretKey(
	Buffer.from(JSON.parse(readFileSync(USER_KEYPAIR_PATH, "utf-8")))
);


const BUYER_KEYPAIR_PATH = homedir() + "/.config/solana/id-new.json";
export const buyerKeypair = Keypair.fromSecretKey(
	Buffer.from(JSON.parse(readFileSync(USER_KEYPAIR_PATH, "utf-8")))
);

export async function uploadAssetFiles(
	umi: Umi,
	name: string,
	description: string
) {
	let fileData = uint8FileData("../onboarding.jpg");
	console.log("-- creating file")
	let file = createGenericFile(fileData, "../onboarding.jpg", {
		contentType: "image/jpeg",
	});
	console.log("-- file created")
	const [image] = await umi.uploader.upload([file]);
	console.log("-- uploading")
	const uri = await umi.uploader.uploadJson({
		name,
		description,
		image,
	});

	return uri;
}


export  async function requestAirdrop(publicKey: PublicKey, amount: number, connection: Connection) {
	try {
	  const airdropSignature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
	  await connection.confirmTransaction(airdropSignature);
	  console.log(`Airdrop of ${amount} SOL requested successfully.`);
	} catch (error) {
	  console.error('Airdrop failed:', error);
	}
  }


 export const txConfig: TransactionBuilderSendAndConfirmOptions = {
    send: { skipPreflight: true },
    confirm: { commitment: 'processed' },
};