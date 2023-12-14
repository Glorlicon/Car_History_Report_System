import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { CarModel, CarRecalls } from '../../../../utils/Interfaces';
import Textarea from '@mui/joy/Textarea';
import TextField from '@mui/material/TextField'

interface CarRecallEditModalCapacityProps {
    action: "Edit" | "Add"
    model: CarRecalls | null,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const CarRecallEditModal: React.FC<CarRecallEditModalCapacityProps> = ({
    action,
    model,
    handleInputChange
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <>
                <div className="pol-crash-form-column">
                    <label>{t('Car Model')}</label>
                    <TextField type="text" name="modelId" value={model?.modelId} onChange={handleInputChange} disabled style={{ width: '100%' }} size='small' />
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('Description')}</label>
                    <Textarea name="description" value={model?.description} onChange={handleInputChange} />
                </div>
      </>
  );
}

export default CarRecallEditModal;