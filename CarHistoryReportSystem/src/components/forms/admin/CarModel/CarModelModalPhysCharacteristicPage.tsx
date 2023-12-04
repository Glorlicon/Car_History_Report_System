import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { BODY_TYPES } from '../../../../utils/const/BodyTypes';
import { CarModel } from '../../../../utils/Interfaces';

interface CarModelModalPhysCharacteristicProps {
    model: CarModel,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const CarModelModalPhysCharacteristicPage: React.FC<CarModelModalPhysCharacteristicProps> = ({
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
                    <label>{t('Dimension')} (mm)</label>
                    <input type="text" name="dimension" value={model.dimension} onChange={handleInputChange} />
                </div>
                <div className="ad-car-model-form-column">
                    <label>{t('Wheel Formula')}</label>
                    <input type="text" name="wheelFormula" value={model.wheelFormula} onChange={handleInputChange} />
                </div>
                <div className="ad-car-model-form-column">
                    <label>{t('Wheel Tread')} (mm)</label>
                    <input type="text" name="wheelTread" value={model.wheelTread} onChange={handleInputChange} />
                </div>
            </div>
            <div className="ad-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>{t('Wheel Base')} (mm)</label>
                    <input type="number" name="wheelBase" value={model.wheelBase} onChange={handleInputChange} min="0" />
                </div>
                <div className="ad-car-model-form-column">
                    <label>{t('Weight')} (kg)</label>
                    <input type="number" name="weight" value={model.weight} onChange={handleInputChange} min="0" />
                </div>
                <div className="ad-car-model-form-column">
                    <label>{t('Body Type')}</label>
                    <select name="bodyType" value={model.bodyType ? model.bodyType : -1} onChange={handleInputChange}>
                        <option value="-1">{t('Not chosen')}</option>
                        <option value={BODY_TYPES.Convertible}>Convertible</option>
                        <option value={BODY_TYPES.Coupe}>Coupe</option>
                        <option value={BODY_TYPES.Crossovers}>Crossovers</option>
                        <option value={BODY_TYPES.Hatchback}>Hatchback</option>
                        <option value={BODY_TYPES.Limousine}>Limousine</option>
                        <option value={BODY_TYPES.MPVs}>MPVs</option>
                        <option value={BODY_TYPES.Pickup}>{t('Pickup')}</option>
                        <option value={BODY_TYPES.Sedan}>Sedan</option>
                        <option value={BODY_TYPES.SUV}>SUV</option>
                        <option value={BODY_TYPES.Van}>Van</option>
                    </select>
                </div>
                <div className="ad-car-model-form-column">
                    <label>{t('Tire Number')}</label>
                    <input type="number" name="tireNumber" value={model.tireNumber} onChange={handleInputChange} min="0" />
                </div>
            </div>
        </>
  );
}

export default CarModelModalPhysCharacteristicPage;