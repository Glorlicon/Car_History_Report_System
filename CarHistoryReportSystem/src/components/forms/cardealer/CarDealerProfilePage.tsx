import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import i18n from '../../../localization/config';
import { RootState } from '../../../store/State';
import TextField from '@mui/material/TextField'
import { CarDealer, DataProvider, EditDataProvider, workingTimes, } from '../../../utils/Interfaces';
import Textarea from '@mui/joy/Textarea';
interface CarDealerProfilePageProps {
    action: "Add" | "Edit";
    userDetails: EditDataProvider;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number, field?: string) => void;
}
const CarDealerProfilePage: React.FC<CarDealerProfilePageProps> = ({
    action,
    userDetails,
    handleInputChange,
}) => {
    const edit = action === "Edit"

    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const daysOfWeek = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday')];
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    



    return (
        <>
                <div className="pol-crash-form-column">
                    <label>{t('Shop Name')}:</label>                   
                    <TextField type="text" name="name" value={userDetails.name} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('Phone Number')}:</label>
                    <TextField type="text" name="phoneNumber" value={userDetails.phoneNumber} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('Address')}:</label>
                    <TextField type="text" name="address" value={userDetails.address} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('Description')}:</label>
                    <Textarea  name="description" value={userDetails.description} onChange={handleInputChange}/>
                </div>
                <div className="pol-crash-form-column">
                    <label>{t('Website Link')}:</label>
                    <TextField type="text" name="websiteLink" value={userDetails.websiteLink} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
                </div>
                
                <div className="pol-crash-form-column">
                    <label>{t('Working Schedule')}: </label>
                    {userDetails?.workingTimes?.map((day, index) => (
                        <div className="dealer-schedule" key={index}>
                            <div className="label">
                                <label className="dayofweek">{daysOfWeek[day.dayOfWeek]}:</label>
                            </div>
                            <div className="input">
                                <input
                                    className="time-input"
                                    type="time"
                                    name="startHour"
                                    value={day.isClosed ? '' : `${String(day.startHour).padStart(2, '0')}:${String(day.startMinute).padStart(2, '0')}`}
                                    disabled={day.isClosed}
                                    onChange={(e) => handleInputChange(e, index, 'startHour')}
                                />
                                <p className="dealer-schedule-separator">-</p>
                                <input
                                    className="time-input"
                                    type="time"
                                    name="endHour"
                                    value={day.isClosed ? '' : `${String(day.endHour).padStart(2, '0')}:${String(day.endMinute).padStart(2, '0')}`}
                                    disabled={day.isClosed}
                                    onChange={(e) => handleInputChange(e, index, 'endHour')}
                                />
                                <input
                                    id={`closed-${index}`}
                                    type="checkbox"
                                    checked={day.isClosed}
                                    onChange={(e) => handleInputChange(e, index, 'isClosed')}
                                />
                                <p className="dealer-schedule-separator">{t('Closed')}</p>
                            </div>
                        </div>
                    ))}
                </div>

        </>
    );
}

export default CarDealerProfilePage;