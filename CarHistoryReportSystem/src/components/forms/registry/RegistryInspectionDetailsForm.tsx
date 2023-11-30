import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CarInspectionHistory } from '../../../utils/Interfaces';
interface RegistryInspectionDetailsFormProps {
    action: "Add" | "Edit"
    model: CarInspectionHistory
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const RegistryInspectionDetailsForm: React.FC<RegistryInspectionDetailsFormProps> = ({
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
          <div className="reg-inspec-form-columns">
              {edit && (
                  <div className="reg-inspec-form-column">
                      <label>Id</label>
                      <input type="text" name="id" value={model.id} onChange={handleInputChange} disabled />
                  </div>
              )}
              <div className="reg-inspec-form-column">
                  <label>{t('Car ID')}</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="reg-inspec-form-column">
                  <label>{t('Description')}</label>
                  <input type="text" name="description" value={model.description} onChange={handleInputChange} />
              </div>
              <div className="reg-inspec-form-column">
                  <label>{t('Odometer')}</label>
                  <input type="number" name="odometer" value={model.odometer} onChange={handleInputChange} min="0" />
              </div>
              <div className="reg-inspec-form-column">
                  <label>{t('Note')}</label>
                  <input type="text" name="note" value={model.note} onChange={handleInputChange} />
              </div>
          </div>
          <div className="reg-inspec-form-columns">
              <div className="reg-inspec-form-column">
                  <label>{t('Inspection Number')}</label>
                  <input type="text" name="inspectionNumber" value={model.inspectionNumber} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="reg-inspec-form-column">
                  <label>{t('Report Date')}</label>
                  <input type="date" name="reportDate" value={model.reportDate} onChange={handleInputChange} />
              </div>
              <div className="reg-inspec-form-column">
                  <label>{t('Inspect Date')}</label>
                  <input type="date" name="inspectDate" value={model.inspectDate} onChange={handleInputChange} />
              </div>
          </div>
      </>
  );
}

export default RegistryInspectionDetailsForm;