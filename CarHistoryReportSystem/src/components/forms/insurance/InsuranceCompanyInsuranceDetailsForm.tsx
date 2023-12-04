import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { CarInsurance } from '../../../utils/Interfaces';
interface InsuranceCompanyInsuranceDetailsFormProps {
    action: "Add" | "Edit"
    model: CarInsurance
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const InsuranceCompanyInsuranceDetailsForm: React.FC<InsuranceCompanyInsuranceDetailsFormProps> = ({
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
          <div className="ins-ins-form-columns">
              {edit && (
                  <div className="ins-ins-form-column">
                      <label>Id</label>
                      <input type="text" name="id" value={model.id} onChange={handleInputChange} disabled />
                  </div>
              )}
              <div className="ins-ins-form-column">
                  <label>{t('Insurance Number')}</label>
                  <input type="text" name="insuranceNumber" value={model.insuranceNumber} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="ins-ins-form-column">
                  <label>{t('Car VIN')}</label>
                  <input type="text" name="carId" value={model.carId} onChange={handleInputChange} disabled={edit} />
              </div>
              <div className="ins-ins-form-column">
                  <label>{t('Description')}</label>
                  <input type="text" name="description" value={model.description} onChange={handleInputChange} />
              </div>
              <div className="ins-ins-form-column">
                  <label>{t('Note')}</label>
                  <input type="text" name="note" value={model.note} onChange={handleInputChange} />
              </div>
          </div>
          <div className="ins-ins-form-columns">
              <div className="ins-ins-form-column">
                  <label>{t('Odometer')}</label>
                  <input type="number" name="odometer" value={model.odometer} onChange={handleInputChange} min="0" />
              </div>
              <div className="ins-ins-form-column">
                  <label>{t('Insurance Start Date')}</label>
                  <input type="date" name="startDate" value={model.startDate} onChange={handleInputChange} />
              </div>
              <div className="ins-ins-form-column">
                  <label>{t('Insurance End Date')}</label>
                  <input type="date" name="endDate" value={model.endDate} onChange={handleInputChange} />
              </div>
              <div className="ins-ins-form-column">
                  <label>{t('Report Date')}</label>
                  <input type="date" name="reportDate" value={model.reportDate} onChange={handleInputChange} />
              </div>
          </div>
      </>
  );
}

export default InsuranceCompanyInsuranceDetailsForm;