import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CarRegistration } from '../../../utils/Interfaces';
interface RegistryRegistrationDetailsFormProps {
    action: "Add" | "Edit"
    model: CarRegistration
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const RegistryRegistrationDetailsForm: React.FC<RegistryRegistrationDetailsFormProps> = ({
    action,
    model,
    handleInputChange
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const edit = action === "Edit"
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
          <div className="reg-reg-form-columns">
              <div className="reg-reg-form-column">
                  <label>{t('Car ID')}</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="reg-reg-form-column">
                  <label>{t('Owner Name')}</label>
                  <input type="text" name="ownerName" value={model.ownerName} onChange={handleInputChange} />
              </div>
              <div className="reg-reg-form-column">
                  <label>{t('Odometer')}</label>
                  <input type="number" name="odometer" value={model.odometer} onChange={handleInputChange} min="0" />
              </div>
              <div className="reg-reg-form-column">
                  <label>{t('Note')}</label>
                  <input type="text" name="note" value={model.note} onChange={handleInputChange} />
              </div>
          </div>
          <div className="reg-reg-form-columns">
              <div className="reg-reg-form-column">
                  <label>{t('Registration Number')}</label>
                  <input type="text" name="registrationNumber" value={model.registrationNumber} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="reg-reg-form-column">
                  <label>{t('License Plate Number')}</label>
                  <input type="text" name="licensePlateNumber" value={model.licensePlateNumber} onChange={handleInputChange}/>
              </div>
              <div className="reg-reg-form-column">
                  <label>{t('Report Date')}</label>
                  <input type="date" name="reportDate" value={model.reportDate} onChange={handleInputChange} />
              </div>
              <div className="reg-reg-form-column">
                  <label>{t('Expire Date')}</label>
                  <input type="date" name="expireDate" value={model.expireDate} onChange={handleInputChange} />
              </div>
          </div>
      </>
  );
}

export default RegistryRegistrationDetailsForm;