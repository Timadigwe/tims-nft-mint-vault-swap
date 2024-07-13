import { createGenericFile, TransactionBuilderSendAndConfirmOptions, Umi } from "@metaplex-foundation/umi";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import dotenv from "dotenv";
import fs, { readFileSync } from "fs";
import path from "path";

dotenv.config();

export const collection = Keypair.generate();
export const asset = Keypair.generate();

// ------------------------------------------- seeds

export const SEED_PREFIX = "anchor";

export const ASSET_MANAGER_PREFIX = "asset manager";

export const SEED_COLLECTION_DATA = "collection";

export const SEED_PROTOCOL = "protocol";


// ---------------------------------------- programs

export const MINT_VAULT_ID = new PublicKey(
	"7B7qYnQAV8SfuxsnkXeWm63H8vYwuKxmWX55avBARUCL"
);

export const SWAP = new PublicKey(
	"7svwjVA2mXBsCDL6SSdYonvswsEnx4y3uZGVtjqyeQzq"
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
// export function uint8FileData(pathName: string): Uint8Array {
// 	const filePath = path.join(__dirname, pathName);

// 	const data = fs.readFileSync(filePath);
// 	return data;
// }


export async function uploadAssetFiles(
	umi: Umi,
	name: string,
	description: string,
	imageUrl: string,
) {
	console.log("-- fetching image from URL");
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
    }

	const arrayBuffer = await response.arrayBuffer();
	const fileData = Buffer.from(arrayBuffer);
	console.log("-- creating file")
	let file = createGenericFile(fileData, "nftImage.jpg", {
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