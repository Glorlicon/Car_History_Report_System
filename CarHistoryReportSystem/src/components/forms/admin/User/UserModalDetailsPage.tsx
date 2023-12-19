import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { User } from '../../../../utils/Interfaces';
import TextField from '@mui/material/TextField'

interface UserModalDetailsPageProps {
    model: User
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
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
      <>
          <div className="pol-crash-form-column">
              <label>{t('First Name')}</label>
              <TextField type="text" name="firstName" value={model.firstName} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
          </div>
          <div className="pol-crash-form-column">
              <label>{t('Last Name')}</label>
              <TextField type="text" name="lastName" value={model.lastName} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
          </div>
          <div className="pol-crash-form-column">
              <label>{t('Phone')}</label>
              <TextField type="text" name="phoneNumber" value={model.phoneNumber} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
          </div>
          <div className="pol-crash-form-column">
              <label>{t('Address')}</label>
              <TextField type="text" name="address" value={model.address} onChange={handleInputChange} style={{ width: '100%' }} size='small' />
          </div>
      </>
  );
}

export default UserModalDetailsPage;