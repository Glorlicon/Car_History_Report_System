import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { COLORS } from '../../../../utils/const/Colors';
import { AdminRequest } from '../../../../utils/Interfaces';

interface RequestAnsweringPageModal {
    action: "Add" | "Edit"
    model: AdminRequest
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const RequestAnsweringPage: React.FC<RequestAnsweringPageModal> = ({
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
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <label>{t('Status')}</label>
                  <select name="status" onChange={handleInputChange}>
                      <option value="1">{t('Approved')}</option>
                      <option value="2">{t('Rejected')}</option>
                  </select>
              </div>
              <div className="ad-car-form-column">
                  <label>{t('Response')}</label>
                  <input type="text" name="response" onChange={handleInputChange} className="TextField" />
              </div>
          </div>
          <div className="ad-car-form-columns">

          </div>
          <div className="ad-car-form-column">

          </div>

      </>
  );
}

export default RequestAnsweringPage;