import { APIResponse, CarImages } from "../../utils/Interfaces";
import { BlobServiceClient } from '@azure/storage-blob';
import path from "path";


const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/jpg']
export async function UploadImages(image: File | null): Promise<APIResponse> {
    if (!image) return { error: "No image was found" }
    //fuck you khoa
    const blobSasUrl = 'https://carhistoryreportsystem.blob.core.windows.net/images?sp=racwdli&st=2023-10-22T13:12:13Z&se=2023-12-30T21:12:13Z&sv=2022-11-02&sr=c&sig=zKs5WLz86nB35z0sh5cNxSvedOe2t9PhtPcV%2B1pebo4%3D'
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

export async function UploadMultipleImages(removedImages: string[],updatedImages: File[] | null): Promise<APIResponse> {
    if (!updatedImages) return { error: "No images were found" }
    const updatedImagesNames: CarImages[] = []
    const blobSasUrl = 'https://carhistoryreportsystem.blob.core.windows.net/images?sp=racwdli&st=2023-10-22T13:12:13Z&se=2023-12-30T21:12:13Z&sv=2022-11-02&sr=c&sig=zKs5WLz86nB35z0sh5cNxSvedOe2t9PhtPcV%2B1pebo4%3D'
    const blobServiceClient = new BlobServiceClient(blobSasUrl);
    const containerName = 'chrs';
    const client = blobServiceClient.getContainerClient(containerName);

    // Deletion
    for (let i = 0; i < removedImages.length; i++) {
        try {
            const blockClient = client.getBlockBlobClient(removedImages[i]);
            await blockClient.delete();
        } catch (error) {
            console.error(`Error deleting ${removedImages[i]} from blob storage`, error);
        }
    }

    // Addition
    for (let i = 0; i < updatedImages.length; i++) {
        const renameImage = `${Date.now()}-${updatedImages[i].name}`;
        const blockClient = client.getBlockBlobClient(renameImage);
        try {
            await blockClient.uploadBrowserData(updatedImages[i], {
                blockSize: 4 * 1024 * 1024, // 4MB blocks
                concurrency: 20,
            });
            updatedImagesNames.push({ imageLink: renameImage });
        } catch (error) {
            console.error(`Error uploading ${updatedImages[i].name} to blob storage`, error);
        }
    }
    return { data: updatedImagesNames }
}

export function GetImages(image: string): string {
    return `https://carhistoryreportsystem.blob.core.windows.net/images/chrs/${image}`
}
