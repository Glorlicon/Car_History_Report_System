import React, { useEffect, useState } from 'react';
import { GetImages } from '../../../services/azure/Images';
import { CarDealer, DataProvider, EditDataProvider } from '../../../utils/Interfaces';
import blank from '../../../blank.png'

interface CarDealerProfileImageProps {
    model: EditDataProvider
    handleAddImages: (event: React.ChangeEvent<HTMLInputElement>) => void
    imageUrl: string | null
}
const CarDealerProfileImage: React.FC<CarDealerProfileImageProps> = ({
    model,
    handleAddImages,
    imageUrl
}) => {

    const handleAddClick = () => {
        document.getElementById('car-image')?.click()
    }
    useEffect(() => {
        if (model.imageLink) {
            console.log("Image Link: ", model);
        }
    }, [model.imageLink]);
    return (
        <div className="dealer-car-sales-form-image-columns">
            <div className="dealer-car-sales-form-image-column">
                <label>Profile Avatar</label>
                    <div className="dealer-car-sales-images">
                    <input type="file" id="profile-picture" accept="image/*" className="profile-edit-picture"  onChange={handleAddImages} />
                    <img src={imageUrl ? imageUrl : blank} id="picture" alt="Click to change" title="Click to change" className="edit-picture" onClick={handleAddClick} />
                    </div>
            </div>
        </div>
    );
}

export default CarDealerProfileImage;