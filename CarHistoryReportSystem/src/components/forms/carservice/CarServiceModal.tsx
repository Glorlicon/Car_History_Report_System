import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CarModel, CarRecalls, CarRecallStatus, CarServiceHistory, CarServices, Services } from '../../../utils/Interfaces';
import TextField from '@mui/material/TextField'
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";
import MuiAlert from '@mui/material/Alert';
interface CarServiceModalCapacityProps {
    action: "Add" | "Edit"
    model: CarServiceHistory
    totalServices: Services[]
    availableServices: Services[]
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    handleDateChange: (date: string, type: string) => void
    handleRemoveService: (value: number) => void
    handleAddService: (value: number) => Promise<void>
    totalRecalls: CarRecallStatus[]
    selectedRecalls: CarRecallStatus[]
    remainingRecalls: CarRecallStatus[]
    handleAddRecall: (id: number) => void
    handleRemoveRecall: (id: number) => void
}

const CarServiceModal: React.FC<CarServiceModalCapacityProps> = ({
    action,
    model,
    totalServices,
    availableServices,
    handleInputChange,
    handleDateChange,
    handleRemoveService,
    handleAddService,
    totalRecalls,
    selectedRecalls,
    remainingRecalls,
    handleAddRecall,
    handleRemoveRecall
}) => {
    const edit = action === "Edit"
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const handleFormatDateChange = (value: Dayjs, type: string) => {
        let newDate = moment(value.toDate()).format('YYYY-MM-DD');
        handleDateChange(newDate, type)
    }
    function countService(value: number): number {
        return totalServices.reduce((count, s) => {
            if (s.value !== 0 && (value & s.value) !== 0) {
                count++;
            }
            return count;
        }, 0);
    }
    function hasRepairCarRecall(value: number): boolean {
        const REPAIR_CAR_RECALL_VALUE = 16; // The value representing RepairCarRecall
        return (value & REPAIR_CAR_RECALL_VALUE) !== 0;
    }
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <>
            <div className="pol-crash-form-column">
                <label>{t('VIN')}</label>
                <TextField type="text" name="carId" value={model.carId} disabled={edit || hasRepairCarRecall(model.services)} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
            </div>
            <div className="pol-crash-form-column">
                <label>{t('Available Services')}</label>
                <select value={0} onChange={(e) => { handleAddService(Number(e.target.value))}}style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
                    {availableServices.map((service, index) => (
                        <option value={service.value} disabled={service.value === 16 && edit}>{t(service.name)}</option>
                    ))}
                </select>
            </div>
            <div className="pol-crash-form-column">
                <label>{t('Selected Services')}: {model.services === 0 ? t('None') : `${countService(model.services)} ${t('Service1')}`}</label>
                {model.services !== 0 && totalServices
                    .filter(service => service.value !== 0 && (model.services & service.value) !== 0)
                    .map((field, index) => (
                    <div key={`service`+index}>
                        <TextField
                            style={{ width: '80%', color:'black' }}
                            value={t(field.name)}
                            className='Mui-disabled'
                        />
                        <IconButton onClick={() => {handleRemoveService(field.value)}} style={{ width: '20%' }} disabled={edit}>
                            {!edit &&  (model.services & 16) !== 0 && <DeleteIcon />}
                        </IconButton>
                    </div>
                ))}
            </div>
            {hasRepairCarRecall(model.services) && (
                <>
                    {!edit && 
                        <div className="pol-crash-form-column">
                            <label>{t('Open Recalls')}</label>
                            <select value={0} onChange={(e) => { handleAddRecall(Number(e.target.value)) }} style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
                                <option value=''>{t('None')}</option>
                                {remainingRecalls.map((recall, index) => (
                                    <option value={recall.carRecallId}>{recall.description}</option>
                                ))}
                            </select>
                        </div>    
                    }
                    <div className="pol-crash-form-column">
                        {!edit && <label>{t('Selected Recalls')}: {selectedRecalls.length === 0 ? t('None') : `${selectedRecalls.length} ${t('Recalls')}`}</label>}
                        {selectedRecalls.length !== 0 && selectedRecalls
                            .map((recall, index) => (
                                <div key={`recall`+index}>
                                    <TextField
                                        style={{ width: '80%', color: 'black' }}
                                        value={recall.description}
                                        className='Mui-disabled'
                                    />
                                    <IconButton onClick={() => { handleRemoveRecall(index) }} style={{ width: '20%' }} disabled={edit}>
                                        {!edit && <DeleteIcon />}
                                    </IconButton>
                                </div>
                            ))}
                    </div>
                    {edit ?
                        <MuiAlert elevation={6} variant="filled" severity="warning" sx={{ width: '85%', zIndex: '2000', marginTop: '10px', marginBottom: '10px' }}>
                            {t('Car Recall Repair in Service History cannot be edited')}!
                        </MuiAlert>
                        :
                        <MuiAlert elevation={6} variant="filled" severity="warning" sx={{ width: '85%', zIndex: '2000', marginTop: '10px', marginBottom: '10px' }}>
                            {t('Car Recall Repair in Service History cannot be edited later so be careful')}!
                        </MuiAlert>
                    }
                </>
            )}
            <div className="pol-crash-form-column">
                <label>{t('Other Services')}</label>
                <TextField type="text" name="otherServices" value={model.otherServices} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
            </div>
            <div className="pol-crash-form-column">
                <label>{t('Note')}</label>
                <TextField type="text" name="note" value={model.note} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
            </div>
            <div className="pol-crash-form-column">
                <label>{t('Odometer')}</label>
                <TextField type="number" name="odometer" value={model.odometer} onChange={handleInputChange} style={{ width: '100%' }} size='small' InputProps={{ inputProps: { min: 0 } }} />
            </div>
            <div className="pol-crash-form-column">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker label={t('Report Date')} defaultValue={dayjs(model.reportDate)} onChange={(value) => { if (value) handleFormatDateChange(value, 'reportDate') }} />
                    </DemoContainer>
                </LocalizationProvider>
            </div>
            <div className="pol-crash-form-column">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker label={t('Service Date')} defaultValue={dayjs(model.serviceTime)} onChange={(value) => { if (value) handleFormatDateChange(value, 'serviceTime') }} />
                    </DemoContainer>
                </LocalizationProvider>
            </div>
        </>
    );
}

export default CarServiceModal;