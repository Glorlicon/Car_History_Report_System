import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CarCrash } from '../../../utils/Interfaces';
interface PoliceCarCrashIdentificationFormProps {
    action: "Add" | "Edit"
    model: CarCrash
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const PoliceCarCrashIdentificationForm: React.FC<PoliceCarCrashIdentificationFormProps> = ({
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
          <div className="pol-crash-form-columns">
              {edit && (
                  <div className="pol-crash-form-column">
                      <label>Id</label>
                      <input type="text" name="id" value={model.id} onChange={handleInputChange} disabled />
                  </div>
              )}
              <div className="pol-crash-form-column">
                  <label>{t('Description')}</label>
                  <input type="text" name="description" value={model.description} onChange={handleInputChange} />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Car VIN')}</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Note')}</label>
                  <input type="text" name="note" value={model.note} onChange={handleInputChange} />
              </div>
          </div>
          <div className="pol-crash-form-columns">
              <div className="pol-crash-form-column">
                  <label>{t('Odometer')}</label>
                  <input type="number" name="odometer" value={model.odometer} onChange={handleInputChange} min="0" />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Accident Date')}</label>
                  <input type="date" name="accidentDate" value={model.accidentDate} onChange={handleInputChange} />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Report Date')}</label>
                  <input type="date" name="reportDate" value={model.reportDate} onChange={handleInputChange} />
              </div>
          </div>
      </>
  );
}

export default PoliceCarCrashIdentificationForm;