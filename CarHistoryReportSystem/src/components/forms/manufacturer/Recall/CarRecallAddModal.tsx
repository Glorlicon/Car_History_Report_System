﻿import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { CarModel, CarRecalls } from '../../../../utils/Interfaces';
import Textarea from '@mui/joy/Textarea';
import TextField from '@mui/material/TextField'
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";
interface CarRecallAddModalCapacityProps {
    recall: CarRecalls,
    models?: CarModel[],
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const CarRecallAddModal: React.FC<CarRecallAddModalCapacityProps> = ({
    recall,
    models,
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
                    <select name="modelId" value={recall.modelId ? recall.modelId : ''} onChange={handleInputChange} style={{ borderRadius: '5px', borderColor: 'gray', height:'40px' }}>
                    <option value=''>{t('Not chosen')}</option>
                        {models?.map((m: any, index: number) => (
                            <option key={index} value={m.modelId}>{m.modelId}</option>
                        ))}
                    </select>
                </div>
            <div className="pol-crash-form-column">
                    <label>{t('Description')}</label>
                    <Textarea name="description" value={recall?.description} onChange={handleInputChange} />
                </div>
        </>
    );
}

export default CarRecallAddModal;