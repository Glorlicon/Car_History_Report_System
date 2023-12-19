import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { CarModel, Manufacturer } from '../../../../utils/Interfaces';
import Textarea from '@mui/joy/Textarea';
import TextField from '@mui/material/TextField'
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";
interface CarModelModalIdentificationProps {
    action: "Add" | "Edit",
    model: CarModel,
    manufacturers: Manufacturer[],
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    handleDateChange: (date: string, type: string) => void
}
const CarModelModalIdentificationPage: React.FC<CarModelModalIdentificationProps> = ({
    action,
    model,
    handleInputChange,
    manufacturers,
    handleDateChange
}) => {
    const edit = action === "Edit"
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const handleFormatDateChange = (value: Dayjs, type: string) => {
        let newDate = moment(value.toDate()).format('YYYY-MM-DD');
        handleDateChange(newDate, type)
    }
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <>
                <div className="pol-crash-form-column">
                    <label>{t('Model ID')}</label>
                    <TextField type="text" name="modelID" value={model.modelID} onChange={handleInputChange} disabled={edit} style={{ width: '100%' }} size='small' />
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('Manufacturer')}</label>
                    <select disabled={edit} name="manufacturerId" value={model.manufacturerId ? model.manufacturerId : -1} onChange={handleInputChange} style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
                        <option value="-1">{t('Not chosen')}</option>
                        {manufacturers.map((manu: any, index: number) => (
                            <option key={index} value={manu.id}>{manu.name}</option>
                        ))}
                    </select>
                </div>
                <div className="pol-crash-form-column">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker label={t('Released Date')} slotProps={{ textField: { fullWidth: true } }} defaultValue={dayjs(model.releasedDate)} onChange={(value) => { if (value) handleFormatDateChange(value, 'releasedDate') }} />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('Country')}</label>
                    <TextField type="text" name="country" value={model.country} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                </div>
      </>    
  );
}

export default CarModelModalIdentificationPage;