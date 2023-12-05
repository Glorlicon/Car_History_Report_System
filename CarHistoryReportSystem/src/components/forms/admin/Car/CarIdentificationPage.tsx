import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Select from 'react-select/dist/declarations/src/Select';
import { RootState } from '../../../../store/State';
import { Car, CarModel } from '../../../../utils/Interfaces';

interface CarIdentificationPageProps {
    action: "Add" | "Edit"
    model: Car
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    carModels: CarModel[]
}
const CarIdentificationPage: React.FC<CarIdentificationPageProps> = ({
    action,
    model,
    handleInputChange,
    carModels
}) => {
    const edit = action === "Edit"
    const options = carModels.map(m => ({
        value: m.modelID,
        label: m.modelID
    }))
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>{t('VIN')}</label>
                  <input type="text" name="vinId" value={model.vinId} onChange={handleInputChange} disabled={edit} />
              </div>
          </div>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>{t('Model')}</label>
                  <select disabled={edit} name="modelId" value={model.modelId ? model.modelId : "notChosen"} onChange={handleInputChange}>
                      <option value="notChosen">{t('Not chosen')}</option>
                      {carModels.map((m: any, index: number) => (
                          <option key={index} value={m.modelID}>{m.modelID} {m.manufacturerName}</option>
                      ))}
                  </select>
              </div>
          </div>
      </>
  );
}

export default CarIdentificationPage;