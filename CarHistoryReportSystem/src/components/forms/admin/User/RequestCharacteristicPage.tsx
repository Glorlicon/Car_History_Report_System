import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { COLORS } from '../../../../utils/const/Colors';
import { AdminRequest, Car, UsersRequest } from '../../../../utils/Interfaces';

interface RequestCharacteristicFormProps {
    action: "Add" | "Edit"
    model: AdminRequest | UsersRequest,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const RequestCharacteristicPage: React.FC<RequestCharacteristicFormProps> = ({
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
                  <label>{t('Type')}</label>
                  <select name="type" onChange={handleInputChange}>
                      <option value="0">{t('Data Correction')}</option>
                      <option value="1">{t('Technical Support')}</option>
                      <option value="2">{t('Report Inaccuracy')}</option>
                      <option value="3">{t('Feedback')}</option>
                      <option value="4">{t('General')}</option>
                  </select>
              </div>
              <div className="ad-car-form-column">
                  <label>{t('Description')}</label>
                  <input type="text" name="description" onChange={handleInputChange} className="TextField" />
              </div>
          </div>
          <div className="ad-car-form-columns">
              
          </div>
          <div className="ad-car-form-column">
              
          </div>
          
      </>
  );
}



export default RequestCharacteristicPage;