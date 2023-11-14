import React, { useEffect, useState } from 'react';
import { GetImages } from '../../../services/azure/Images';
import { CarDealer } from '../../../utils/Interfaces';

interface CarDealerProfileImageProps {
    model: CarDealer
    handleAddImages: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleRemoveImages: (index: number) => void
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
        if (model.carDealerImage) {
            console.log("Image: ", model.carDealerImage)
            console.log(model?.carDealerImage?.avatarImageLink)
        }
            
    },)
    return (
        <div className="dealer-car-sales-form-image-columns">
            <div className="dealer-car-sales-form-image-column">
                <label>Profile Avatar</label>
                <input type="file" id="car-image" accept="image/*" className="car-images-input" onChange={handleAddImages}/>
                <button onClick={handleAddClick} className="dealer-car-sales-form-image-add-button"> + Add Image</button>
                {model.carDealerImage ? (
                    <div className="dealer-car-sales-images">
                        <img src={
                            model?.carDealerImage?.id?.trim() === "" ?
                                GetImages(model?.carDealerImage.avatarImageLink as string) :
                                model?.carDealerImage?.avatarImageLink
                        }
                            alt="Car" className="dealer-car-sales-details-image" />
                    </div>
                ) : (
                    <div className="dealer-car-sales-images">
                        No avatar
                    </div>
                )}
            </div>
        </div>
    );
}

export default CarDealerProfileImage;