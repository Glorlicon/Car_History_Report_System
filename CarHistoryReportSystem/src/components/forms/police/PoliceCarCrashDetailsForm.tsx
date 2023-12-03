import React, { useEffect } from 'react';
import { CarCrash } from '../../../utils/Interfaces';
import car from '../../../car.jpg'
import { CAR_SIDES } from '../../../utils/const/CarSides';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
interface PoliceCarCrashDetailsFormProps {
    action: "Add" | "Edit"
    model: CarCrash
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleDamageLocationChange: (sideValue: number) => void
}
const PoliceCarCrashDetailsForm: React.FC<PoliceCarCrashDetailsFormProps> = ({
    action,
    model,
    handleInputChange,
    handleDamageLocationChange
}) => {
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const isSideColored = (sideValue: number): boolean => {
        return (model.damageLocation & sideValue) === sideValue;
    };
    const edit = action === "Edit"
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
          <div className="pol-crash-form-columns">
              <div className="pol-crash-form-column">
                  <label>{t('Location')}</label>
                  <input type="text" name="location" value={model.location} onChange={handleInputChange} />
              </div>
              <div className="pol-crash-form-column">
                  <label>{t('Severity')}</label>
                  <input type="number" name="serverity" value={model.serverity} onChange={handleInputChange} min="0" step="0.01" max="1"/>
              </div>
          </div>
          <div className="pol-crash-form-columns">
              <div className="pol-crash-form-column">
                  <label>{t('Damage Location')}</label>
                  <div className="pol-crash-car-container">
                      <img src={car} alt="Car" className="pol-crash-car-image" style={{
                          borderTop: `5px solid ${isSideColored(CAR_SIDES.Front) ? 'red' : 'black'}`,
                          borderBottom: `5px solid ${isSideColored(CAR_SIDES.Rear) ? 'red' : 'black'}`,
                          borderLeft: `5px solid ${isSideColored(CAR_SIDES.Left) ? 'red' : 'black'}`,
                          borderRight: `5px solid ${isSideColored(CAR_SIDES.Right) ? 'red' : 'black'}`,
                      }} />
                  </div>
              </div>
              <div className="pol-crash-form-column">
                  <div className="pol-crash-checkboxes">
                      {Object.entries(CAR_SIDES).map(([key, value]) => (
                          <label key={key}>
                              {t(key.charAt(0).toUpperCase() + key.slice(1))}
                              <input
                                  type="checkbox"
                                  checked={isSideColored(value)}
                                  onChange={() => handleDamageLocationChange(value)}
                              />
                          </label>
                      ))}
                  </div>
              </div>
          </div>
      </>
  );
}

export default PoliceCarCrashDetailsForm;