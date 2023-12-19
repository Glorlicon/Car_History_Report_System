import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CarModel, CarRecalls, CarServices, Services } from '../../../utils/Interfaces';

interface CarServiceSearchCarRecallCapacityProps {
    action: "Add" | "Edit"
    searchQuery: string,
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}
const CarServiceSearchCarRecall: React.FC<CarServiceSearchCarRecallCapacityProps> = ({
    action,
    searchQuery,
    handleSearchChange,
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
                    <input type="text" value={searchQuery}
                        onChange={handleSearchChange} min="0" />
                    </div>
            </div>
            <div> </div>
        </>
    );
}

export default CarServiceSearchCarRecall;