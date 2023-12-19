import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { CarModel } from '../../../../utils/Interfaces';
import Textarea from '@mui/joy/Textarea';
import TextField from '@mui/material/TextField'
interface CarModelModalCapacityProps {
    model: CarModel,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
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
                <div className="pol-crash-form-column">
                    <label>{t('Person Carried Number')}</label>
                    <TextField type="number" name="personCarriedNumber" value={model.personCarriedNumber} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('Seat Number')}</label>
                    <TextField type="number" name="seatNumber" value={model.seatNumber} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('Laying Place Number')}</label>
                <TextField type="number" name="layingPlaceNumber" value={model.layingPlaceNumber} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
            </div>
      </>
  );
}

export default CarModelCapacityPage;