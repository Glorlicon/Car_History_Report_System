import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { FUEL_TYPES } from '../../../../utils/const/FuelTypes';
import { CarModel } from '../../../../utils/Interfaces';

interface CarModelModalEngineProps {
    model: CarModel,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const CarModelModalEnginePage: React.FC<CarModelModalEngineProps> = ({
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
                    <label>{t('Fuel Type')}</label>
                    <select name="fuelType" value={model.fuelType ? model.fuelType : -1} onChange={handleInputChange}>
                        <option value="-1">{t('Not chosen')}</option>
                        <option value={FUEL_TYPES.BioDiesel}>BioDiesel</option>
                        <option value={FUEL_TYPES.Diesel}>Diesel</option>
                        <option value={FUEL_TYPES.Ethanol}>Ethanol</option>
                        <option value={FUEL_TYPES.Gasoline}>Gasoline</option>
                    </select>
                </div>
                <div className="ad-car-model-form-column">
                    <label>{t('Maximum Output')} (kW)</label>
                    <input type="number" name="maximumOutput" value={model.maximumOutput} onChange={handleInputChange} min="0" />
                </div>
            </div>
            <div className="ad-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>{t('Engine Displacement')} (cm3)</label>
                    <input type="number" name="engineDisplacement" value={model.engineDisplacement} onChange={handleInputChange} min="0" />
                </div>
                <div className="ad-car-model-form-column">
                    <label>{t('RPM')}</label>
                    <input type="number" name="rpm" value={model.rpm} onChange={handleInputChange} min="0" />
                </div>
            </div>
      </>
  );
}

export default CarModelModalEnginePage;