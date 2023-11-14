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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevImage = () => {
        if (!model || !model.carImages) {
            return
        }
        if (currentImageIndex === 0) {
            setCurrentImageIndex(model.carImages!.length - 1)
        } else {
            setCurrentImageIndex((prev) => (prev - 1))
        }
    };

    const handleNextImage = () => {
        if (!model || !model.carImages) {
            return
        }
        if (currentImageIndex === model.carImages!.length - 1) {
            setCurrentImageIndex(0)
        } else {
            setCurrentImageIndex((prev) => (prev + 1))
        }
    };
    const handleChangeIndex = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1)
        }
    }
    const handleAddClick = () => {
        document.getElementById('car-image')?.click()
    }
    useEffect(() => {
        if (model.carImages)
            console.log("Image: ", model.carImages[currentImageIndex])
    }, [currentImageIndex])
    return (
        <div className="dealer-car-sales-form-image-columns">
            <div className="dealer-car-sales-form-image-column">
                <label>Car Images</label>
                <input type="file" id="car-image" accept="image/*" className="car-images-input" onChange={handleAddImages} multiple />
                <button onClick={handleAddClick} className="dealer-car-sales-form-image-add-button"> + Add Image</button>
                {model.carImages && model.carImages?.length > 0 ? (
                    <div className="dealer-car-sales-images">
                        <button className="dealer-car-sales-images-arrow-left" onClick={handlePrevImage}>&lt;</button>
                        <img src={
                            model?.carImages?.at(currentImageIndex)?.id != -1 ?
                                GetImages(model?.carImages?.at(currentImageIndex)?.imageLink as string) :
                                model?.carImages?.at(currentImageIndex)?.imageLink
                        }
                            alt="Car" className="dealer-car-sales-details-image" />
                        <button className="dealer-car-sales-images-arrow-right" onClick={handleNextImage}>&gt;</button>
                        <a>
                            <strong>
                                Total Images: {model.carImages?.length}
                            </strong>
                        </a>
                        <button type="button" className="dealer-car-sales-form-image-remove-button" onClick={() => { handleRemoveImages(currentImageIndex); handleChangeIndex() }}>Remove Current</button>
                    </div>
                ) : (
                    <div className="dealer-car-sales-images">
                        No images for this car
                    </div>
                )}
            </div>
        </div>
    );
}

export default CarDealerProfileImage;