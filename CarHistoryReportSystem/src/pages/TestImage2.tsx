import React, { useEffect, useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import { GetImages } from '../services/azure/Images';

const TestImage2: React.FC = () => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const images = [
        { "name": "splunk" },
        { "name": "test" }
    ]

  return (
      <div>
          {images.map((img, index) => (
              <img key={index} src={GetImages(img.name)} alt="Stored Blob" style={{ maxWidth: '300px', margin: '10px' }} />
          ))}
      </div>
  );
}

export default TestImage2;