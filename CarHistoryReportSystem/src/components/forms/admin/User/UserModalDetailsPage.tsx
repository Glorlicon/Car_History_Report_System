import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { User } from '../../../../utils/Interfaces';

interface UserModalDetailsPageProps {
    model: User
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
const UserModalDetailsPage: React.FC<UserModalDetailsPageProps> = ({
    model,
    handleInputChange
}) => {
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <div className="ad-user-form-columns">
          <div className="ad-user-form-column">
              <label>{t('First Name')}</label>
              <input type="text" name="firstName" value={model.firstName} onChange={handleInputChange} required />
          </div>
          <div className="ad-user-form-column">
              <label>{t('Last Name')}</label>
              <input type="text" name="lastName" value={model.lastName} onChange={handleInputChange} required />
          </div>
          <div className="ad-user-form-column">
              <label>{t('Phone')}</label>
              <input type="text" name="phoneNumber" value={model.phoneNumber} onChange={handleInputChange} required />
          </div>
          <div className="ad-user-form-column">
              <label>{t('Address')}</label>
              <input type="text" name="address" value={model.address} onChange={handleInputChange} required />
          </div>
      </div>
  );
}

export default UserModalDetailsPage;