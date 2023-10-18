import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import { UploadImages } from '../services/azure/Images';

const TestImage: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);

            // Create an object URL to display the image in the component
            const url = URL.createObjectURL(file);
            setImageUrl(url);
        }
    }

    const onUpload = async () => {
        const result = await UploadImages(image)
        if (result.error) setUploadStatus(result.error)
        else setUploadStatus(result.data)
    }
  return (
      <div>
          <input type="file" onChange={onImageChange} />
          <button onClick={onUpload}>Save to Azure Blob</button>

          {imageUrl && <img src={imageUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: '20px' }} />}

          <p>{uploadStatus}</p>
      </div>
  );
}

export default TestImage;