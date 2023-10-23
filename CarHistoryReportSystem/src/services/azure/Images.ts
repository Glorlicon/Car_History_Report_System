import { APIResponse } from "../../utils/Interfaces";
import { BlobServiceClient } from '@azure/storage-blob';

export async function UploadImages(image: File | null): Promise<APIResponse> {
    if (!image) return { error: "No image was found" }
    const blobSasUrl = 'https://carhistoryreportsystem.blob.core.windows.net/images?sp=racwdli&st=2023-10-18T18:40:40Z&se=2023-10-25T18:40:40Z&sv=2022-11-02&sr=c&sig=lcRIP2y61fLANLycJ5GlAeO07Vm%2F97lII7pDUN7WOG0%3D'
    const blobServiceClient = new BlobServiceClient(blobSasUrl);
    const containerName = 'chrs';
    const client = blobServiceClient.getContainerClient(containerName);
    const renameImage = `${Date.now()}-${image.name}`
    const blockClient = client.getBlockBlobClient(renameImage);
    console.log("Image", renameImage)
    try {
        await blockClient.uploadBrowserData(image, {
            blockSize: 4 * 1024 * 1024, // 4MB blocks
            concurrency: 20,
        });
        //setUploadStatus('Image uploaded successfully');
        return { data: renameImage }
    } catch (error) {
        console.error('Error uploading to blob storage', error);
        //setUploadStatus('Failed to upload image');
        return { error:"Failed to upload image"}
    }
}

export function GetImages(image: string): string {
    return `https://carhistoryreportsystem.blob.core.windows.net/images/chrs/${image}`
}