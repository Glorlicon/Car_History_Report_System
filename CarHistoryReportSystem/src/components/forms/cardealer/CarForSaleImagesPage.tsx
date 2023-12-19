import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GetImages } from '../../../services/azure/Images';
import { RootState } from '../../../store/State';
import { CarSalesInfo } from '../../../utils/Interfaces';
import emptyCar from '../../../images/car-default.jpg'

interface CarForSaleImagesPageProps {
    model: CarSalesInfo
    handleAddImages: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleRemoveImages: (index: number) => void
}
const CarForSaleImagesPage: React.FC<CarForSaleImagesPageProps> = ({
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
            setCurrentImageIndex(currentImageIndex-1)
        } 
    }
    const handleAddClick = () => {
        document.getElementById('car-image')?.click()
    }
    useEffect(() => {
        if (model.carImages)
            console.log("Image: ", model.carImages[currentImageIndex])
    }, [currentImageIndex])
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
          <>
          <div className="dealer-car-sales-form-image-column">
              <label>{t('Car Images')}</label>
              <a>
                  <strong>
                      {t('Total Images')}: {model.carImages?.length}
                  </strong>
              </a>
              <input type="file" id="car-image" accept="image/*" className="car-images-input" onChange={handleAddImages} multiple />
              <button onClick={handleAddClick} className="dealer-car-sales-form-image-add-button"> + {t('Add Image')}</button>
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
                      < button type="button" className="dealer-car-sales-form-image-remove-button" onClick={() => { handleRemoveImages(currentImageIndex); handleChangeIndex() }}>{t('Remove Current Image')}</button>
                      </div>
                  ): (
                      <div className="dealer-car-sales-images">
                          <img src={emptyCar} />
                      </div>
                  )}
              </div>
          </>
  );
}

export default CarForSaleImagesPage;