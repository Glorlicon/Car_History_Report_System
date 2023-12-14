import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { FUEL_TYPES } from '../../../../utils/const/FuelTypes';
import { CarModel } from '../../../../utils/Interfaces';
import Textarea from '@mui/joy/Textarea';
import TextField from '@mui/material/TextField'

interface CarModelModalEngineProps {
    model: CarModel,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
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
                <div className="pol-crash-form-column">
                    <label>{t('Fuel Type')}</label>
                    <select name="fuelType" value={model.fuelType ? model.fuelType : -1} onChange={handleInputChange} style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
                        <option value="-1">{t('Not chosen')}</option>
                        <option value={FUEL_TYPES.BioDiesel}>BioDiesel</option>
                        <option value={FUEL_TYPES.Diesel}>Diesel</option>
                        <option value={FUEL_TYPES.Ethanol}>Ethanol</option>
                        <option value={FUEL_TYPES.Gasoline}>Gasoline</option>
                    </select>
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('Maximum Output')} (kW)</label>
                    <TextField type="number" name="maximumOutput" value={model.maximumOutput} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('Engine Displacement')} (cm3)</label>
                    <TextField type="number" name="engineDisplacement" value={model.engineDisplacement} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('RPM')}</label>
                    <TextField type="number" name="rpm" value={model.rpm} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
                </div>
      </>
  );
}

export default CarModelModalEnginePage;