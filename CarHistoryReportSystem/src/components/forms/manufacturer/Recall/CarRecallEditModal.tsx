import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { CarModel, CarRecalls } from '../../../../utils/Interfaces';

interface CarRecallEditModalCapacityProps {
    action: "Edit" | "Add"
    model: CarRecalls | null,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const CarRecallEditModal: React.FC<CarRecallEditModalCapacityProps> = ({
    action,
    model,
    handleInputChange
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    return (
        <>
            <div className="manu-car-model-form-columns">
                <div className="manu-car-model-form-column">
                    <label>{t('Car Model')}</label>
                    <input type="text" name="modelId" value={model?.modelId} onChange={handleInputChange} required disabled />
                </div>
            </div>
            <div className="manu-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>{t('Description')}</label>
                    <input type="text" name="description" value={model?.description} onChange={handleInputChange} min="0" />
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

export default CarRecallEditModal;