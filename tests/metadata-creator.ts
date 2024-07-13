import Arweave from 'arweave';

// Initialize Arweave client
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});


// async function generateKey()  { 
//    const key = arweave.wallets.generate().then((key) => {
//     console.log(key);
//     // {
//     //     "kty": "RSA",
//     //     "n": "3WquzP5IVTIsv3XYJjfw5L-t4X34WoWHwOuxb9V8w...",
//     //     "e": ...
//     return key
// });
//  return key
// }

// Function to upload image to Arweave
async function uploadImageToArweave(imageBuffer: Buffer): Promise<string> {
    let key = await arweave.wallets.generate();
  const transaction = await arweave.createTransaction({ data: imageBuffer }, key);
  transaction.addTag('Content-Type', 'image/png');

  await arweave.transactions.sign(transaction, key);
  const response = await arweave.transactions.post(transaction);

  if (response.status === 200) {
    return transaction.id;
  } else {
    throw new Error('Failed to upload image to Arweave');
  }
}

// Function to upload metadata to Arweave
async function uploadMetadataToArweave(metadata: object): Promise<string> {
  const transaction = await arweave.createTransaction({ data: JSON.stringify(metadata) });
  transaction.addTag('Content-Type', 'application/json');

  await arweave.transactions.sign(transaction);
  const response = await arweave.transactions.post(transaction);

  if (response.status === 200) {
    return transaction.id;
  } else {
    throw new Error('Failed to upload metadata to Arweave');
  }
}

// Function to create dynamic metadata
export async function createDynamicMetadata(imagePath: string, name: string, symbol: string, decimal: number): Promise<{ name: string, symbol: string, decimal: number, metadataUri: string }> {
  try {
    // Fetch image file
    const response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Upload image to Arweave
    const imageTxId = await uploadImageToArweave(imageBuffer);

    // Construct metadata
    const metadata = {
      uri: `https://arweave.net/${imageTxId}`,
      name: name,
      symbol: symbol,
      decimal: decimal
    };

    // Upload metadata to Arweave
    const metadataTxId = await uploadMetadataToArweave(metadata);

    // Return metadata URI along with other details
    return {
      name: name,
      symbol: symbol,
      decimal: decimal,
      metadataUri: `https://arweave.net/${metadataTxId}`
    };
  } catch (error) {
    console.error('Error creating dynamic metadata:', error);
    throw error;
  }
}

// Example usage
// (async () => {
//   const imagePath = 'path_to_your_image.png'; // Replace with your image path or URL
//   const name = 'Dynamic NFT';
//   const symbol = 'DNFT';
//   const decimal = 0;

//   const metadataResults = await createDynamicMetadata(imagePath, name, symbol, decimal);
//   console.log('Metadata URI:', metadataResults);
// })();
