import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { BODY_TYPES } from '../../../../utils/const/BodyTypes';
import { CarModel } from '../../../../utils/Interfaces';
import TextField from '@mui/material/TextField'

interface CarModelModalPhysCharacteristicProps {
    model: CarModel,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
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
            <div className="pol-crash-form-column">
                <label>{t('Dimension')} (mm)</label>
                <TextField type="text" name="dimension" value={model.dimension} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
            </div>
            <div className="pol-crash-form-column">
                <label>{t('Wheel Formula')}</label>
                <TextField type="text" name="wheelFormula" value={model.wheelFormula} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
            </div>
            <div className="pol-crash-form-column">
                <label>{t('Wheel Tread')} (mm)</label>
                <TextField type="text" name="wheelTread" value={model.wheelTread} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
            </div>
            <div className="pol-crash-form-column">
                <label>{t('Wheel Base')} (mm)</label>
                <TextField type="number" name="wheelBase" value={model.wheelBase} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
            </div>
            <div className="pol-crash-form-column">
                <label>{t('Weight')} (kg)</label>
                <TextField type="number" name="weight" value={model.weight} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
            </div>
            <div className="pol-crash-form-column">
                <label>{t('Body Type')}</label>
                <select name="bodyType" value={model.bodyType ? model.bodyType : -1} onChange={handleInputChange} style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
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
            <div className="pol-crash-form-column">
                <label>{t('Tire Number')}</label>
                <TextField type="number" name="tireNumber" value={model.tireNumber} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
            </div>
        </>
  );
}

export default CarModelModalPhysCharacteristicPage;