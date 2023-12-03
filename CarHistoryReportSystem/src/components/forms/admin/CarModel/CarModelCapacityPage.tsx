import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { CarModel } from '../../../../utils/Interfaces';

interface CarModelModalCapacityProps {
    model: CarModel,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const CarModelCapacityPage: React.FC<CarModelModalCapacityProps> = ({
    model,
    handleInputChange
}) => {
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <>
            <div className="ad-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>{t('Person Carried Number')}</label>
                    <input type="number" name="personCarriedNumber" value={model.personCarriedNumber} onChange={handleInputChange} min="0" />
                </div>
            </div>
            <div className="ad-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>{t('Seat Number')}</label>
                    <input type="number" name="seatNumber" value={model.seatNumber} onChange={handleInputChange} min="0" />
                </div>
                <div className="ad-car-model-form-column">
                    <label>{t('Laying Place Number')}</label>
                    <input type="number" name="layingPlaceNumber" value={model.layingPlaceNumber} onChange={handleInputChange} min="0" />
                </div>
            </div>
      </>
  );
}

export default CarModelCapacityPage;