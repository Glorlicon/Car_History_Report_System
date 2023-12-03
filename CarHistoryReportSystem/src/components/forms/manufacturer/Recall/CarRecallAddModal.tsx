import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { CarModel, CarRecalls } from '../../../../utils/Interfaces';

interface CarRecallAddModalCapacityProps {
    recall: CarRecalls,
    models?: CarModel[],
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const CarRecallAddModal: React.FC<CarRecallAddModalCapacityProps> = ({
    recall,
    models,
    handleInputChange
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    return (
        <>
            <div className="manu-car-model-form-columns">
                <div className="manu-car-model-form-column">
                    <label>{t('Car Model')}</label>
                    <select name="modelId" value={recall.modelId} onChange={handleInputChange}>
                        {models?.map((m: any, index: number) => (
                            <option key={index} value={m.modelID}>{m.modelID}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>{t('Description')}</label>
                    <input type="text" name="description" onChange={handleInputChange} min="0" />
                </div>
                {/*ẩn vì date có thể lấy ngày hiện tại luôn*/}
                {/*<div className="ad-car-model-form-column">*/}
                {/*    <label>Date</label>*/}
                {/*    <input type="date" name="recallDate" onChange={handleInputChange} min="0" />*/}
                {/*</div>*/}
            </div>
        </>
    );
}

export default CarRecallAddModal;