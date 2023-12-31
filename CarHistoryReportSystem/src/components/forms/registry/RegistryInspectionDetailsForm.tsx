import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CarInspectionHistory } from '../../../utils/Interfaces';
import Textarea from '@mui/joy/Textarea';
import TextField from '@mui/material/TextField'
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";
interface RegistryInspectionDetailsFormProps {
    action: "Add" | "Edit"
    model: CarInspectionHistory
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    handleDateChange: (date: string, type: string) => void
}
const RegistryInspectionDetailsForm: React.FC<RegistryInspectionDetailsFormProps> = ({
    action,
    model,
    handleInputChange,
    handleDateChange
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const edit = action === "Edit"
    const handleFormatDateChange = (value: Dayjs, type: string) => {
        let newDate = moment(value.toDate()).format('YYYY-MM-DD');
        handleDateChange(newDate, type)
    }
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
              {edit && (
                  <div className="pol-crash-form-column">
                      <label>Id</label>
                      <TextField type="text" name="id" value={model.id} onChange={handleInputChange} disabled style={{ width: '100%' }} size='small'/>
                  </div>
              )}
              <div className="pol-crash-form-column">
                  <label>{t('Car ID')}</label>
                  <TextField type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} style={{ width: '100%' }} size='small'/>
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Description')}</label>
                  <Textarea  name="description" value={model.description} onChange={handleInputChange}/>
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Odometer')}</label>
                  <TextField type="number" name="odometer" value={model.odometer} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }}/>
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Note')}</label>
                  <TextField type="text" name="note" value={model.note} onChange={handleInputChange} style={{ width: '100%' }} size='small'/>
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Inspection Number')}</label>
                  <TextField type="text" name="inspectionNumber" value={model.inspectionNumber} onChange={handleInputChange} disabled={edit} style={{ width: '100%' }} size='small'/>
              </div>
              <div className="pol-crash-form-column">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker label={t('Report Date')} defaultValue={dayjs(model.reportDate)} onChange={(value) => { if (value) handleFormatDateChange(value, 'reportDate') }} />
                      <DatePicker label={t('Inspect Date')} defaultValue={dayjs(model.inspectDate)} onChange={(value) => { if (value) handleFormatDateChange(value, 'inspectDate') }} />
                  </DemoContainer>
              </LocalizationProvider>
              </div>
      </>
  );
}

export default RegistryInspectionDetailsForm;