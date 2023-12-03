import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CAR_STOLEN_STATUS } from '../../../utils/const/CarStolenStatus';
import { CarStolen } from '../../../utils/Interfaces';

interface PoliceCarStolenDetailsFormProps {
    action: "Add" | "Edit"
    model: CarStolen
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const PoliceCarStolenDetailsForm: React.FC<PoliceCarStolenDetailsFormProps> = ({
    action,
    model,
    handleInputChange
}) => {
    const edit = action === "Edit"
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
          <div className="pol-stolen-form-columns">
              {edit && (
                  <div className="pol-stolen-form-column">
                      <label>Id</label>
                      <input type="text" name="id" value={model.id} onChange={handleInputChange} disabled />
                  </div>
              )}
              <div className="pol-stolen-form-column">
                  <label>{t('Description')}</label>
                  <input type="text" name="description" value={model.description} onChange={handleInputChange} />
              </div>
              <div className="pol-stolen-form-column">
                  <label>{t('Car VIN')}</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="pol-stolen-form-column">
                  <label>{t('Note')}</label>
                  <input type="text" name="note" value={model.note} onChange={handleInputChange}/>
              </div>
          </div>
          <div className="pol-stolen-form-columns">
              <div className="pol-stolen-form-column">
                  <label>{t('Odometer')}</label>
                  <input type="number" name="odometer" value={model.odometer} onChange={handleInputChange} min="0"/>
              </div>
              <div className="pol-stolen-form-column">
                  <label>{t('Report Date')}</label>
                  <input type="date" name="reportDate" value={model.reportDate} onChange={handleInputChange} />
              </div>
              <div className="pol-stolen-form-column">
                  <label>{t('Status')}</label>
                  <select name="status" value={model.status ? model.status : CAR_STOLEN_STATUS.Stolen} onChange={handleInputChange}>
                      <option value={CAR_STOLEN_STATUS.Stolen}>{t('Stolen')}</option>
                      <option value={CAR_STOLEN_STATUS.Found}>{t('Found')}</option>
                  </select>
              </div>
          </div>
      </>
  );
}

export default PoliceCarStolenDetailsForm;