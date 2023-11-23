import React, { useEffect, useState } from 'react';
import { GetImages } from '../../../services/azure/Images';
import { CarDealer, DataProvider } from '../../../utils/Interfaces';

interface CarDealerProfileImageProps {
    model: DataProvider
    handleAddImages: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleRemoveImages: () => void
}
const CarDealerProfileImage: React.FC<CarDealerProfileImageProps> = ({
    model,
    handleAddImages,
    handleRemoveImages
}) => {

    const handleAddClick = () => {
        document.getElementById('car-image')?.click()
    }
    useEffect(() => {
        if (model.imagelink) {
            console.log("Image Link: ", model.imagelink);
        }
    }, [model.imagelink]);
    return (
        <div className="dealer-car-sales-form-image-columns">
            <div className="dealer-car-sales-form-image-column">
                <label>Profile Avatar</label>
                <input type="file" id="car-image" accept="image/*" className="car-images-input" onChange={handleAddImages} />
                <button onClick={handleAddClick} className="dealer-car-sales-form-image-add-button">+ Add Image</button>
                {model.imagelink ? (
                    <div className="dealer-car-sales-images">
                        <img src={model.imagelink} alt="Avatar" className="dealer-car-sales-details-image" />
                    </div>
                ) : (
                    <div className="dealer-car-sales-images">No avatar</div>
                )}
            </div>
        </div>
    );
}

export default CarDealerProfileImage;