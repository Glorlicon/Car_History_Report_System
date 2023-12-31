﻿import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CarModel, CarRecalls, CarServices, ServiceCarRecalls, Services } from '../../../utils/Interfaces';

interface CarServiceRecallStatusCapacityProps {
    action: "Add" | "Edit",
    searchQuery: string,
    newRecall: ServiceCarRecalls[],
    handleCloseRecall: (Status: string, CarId: string, RecallId: number) => void

}

const CarServiceRecallStatus: React.FC<CarServiceRecallStatusCapacityProps> = ({
    action,
    searchQuery,
    newRecall,
    handleCloseRecall
}) => {
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <>
            <div className="manu-car-model-form-columns">
                    <div className="ad-car-model-form-column">
                    <label>{t('VIN')}</label>
                    <input type="text" name="carId" value={searchQuery} disabled min="0" />
                    </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="dealer-car-sales-form-column">
                    <label>{t('Recalls availible for car')}: </label>
                    <ul className="dealer-car-sales-feature-list">
                        {newRecall.map((serviceValue, index) => (
                            <li key={index} className="dealer-car-sales-feature-list-item">
                                <span style={{ marginRight: '10px' }}>{serviceValue.carRecallId}</span>
                                <button
                                    className="dealer-car-sales-remove-feature-btn"
                                    type="button"
                                    onClick={() => handleCloseRecall(serviceValue.status, serviceValue.carId, serviceValue.carRecallId)}>
                                    {serviceValue.status === 'Open' ? 'Close Recall' : 'Open Recall'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div> </div>
        </>
    );
}

export default CarServiceRecallStatus;