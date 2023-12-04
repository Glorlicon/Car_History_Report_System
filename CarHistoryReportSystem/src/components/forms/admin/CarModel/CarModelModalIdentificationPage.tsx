import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { CarModel, Manufacturer } from '../../../../utils/Interfaces';
//fix later
interface CarModelModalIdentificationProps {
    action: "Add" | "Edit",
    model: CarModel,
    manufacturers: Manufacturer[],
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const CarModelModalIdentificationPage: React.FC<CarModelModalIdentificationProps> = ({
    action,
    model,
    handleInputChange,
    manufacturers
}) => {
    const edit = action === "Edit"
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <>
            <div className="ad-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>{t('Model ID')}</label>
                    <input type="text" name="modelID" value={model.modelID} onChange={handleInputChange} required disabled={edit} />
                </div>
                <div className="ad-car-model-form-column">
                    <label>{t('Manufacturer')}</label>
                    <select disabled={edit} name="manufacturerId" value={model.manufacturerId} onChange={handleInputChange}>
                        {manufacturers.map((manu: any, index: number) => (
                            <option key={index} value={manu.id}>{manu.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="ad-car-model-form-columns">
                <div className="ad-car-model-form-column">
                    <label>{t('Released Date')}</label>
                    <input type="date" name="releasedDate" value={model.releasedDate} onChange={handleInputChange} />
                </div>
                <div className="ad-car-model-form-column">
                    <label>{t('Country')}</label>
                    <input type="text" name="country" value={model.country} onChange={handleInputChange} />
                </div>
            </div>
      </>    
  );
}

export default CarModelModalIdentificationPage;