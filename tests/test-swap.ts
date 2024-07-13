import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
	SystemProgram,
} from "@solana/web3.js";
import { TimsSwap } from "../target/types/tims_swap";
import {
	asset,
	collection,
	CORE_PROGRAM_ID,
	findAssetManagerAddress,
	findProtocolAddress,
	MINT_VAULT_ID,
} from "./utils";

describe("tim-swap", () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.AnchorProvider.env());

	const provider = anchor.getProvider();

	const program = anchor.workspace.TimsSwap as Program<TimsSwap>;

	it("Swaps tokens for NFTs!", async () => {
	

		const previousOwner = provider.publicKey

		const txHash = await program.methods
			.swap()
			.accountsStrict({
				payer: provider.publicKey,
				buyer: provider.publicKey,
				previousOwner,
				asset: asset.publicKey,
				collection: collection.publicKey,
				assetManager: findAssetManagerAddress(),
				protocol: findProtocolAddress(),
				coreProgram: CORE_PROGRAM_ID,
				mintVaultProgram: MINT_VAULT_ID,
				systemProgram: SystemProgram.programId,
			})
			.rpc();
		console.log(
			`tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet\n`
		);
	});
});
