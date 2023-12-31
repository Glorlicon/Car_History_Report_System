import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { GetDataProviders } from '../../../../services/api/Users';
import { RootState } from '../../../../store/State';
import { USER_ROLE } from '../../../../utils/const/UserRole';
import { DataProvider, User } from '../../../../utils/Interfaces';
import Textarea from '@mui/joy/Textarea';
import TextField from '@mui/material/TextField'

interface UserModalAccountPageProps {
    model: User
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    action: "Add" | "Edit"
}
const UserModalAccountPage: React.FC<UserModalAccountPageProps> = ({
    model,
    handleInputChange,
    action
}) => {
    const edit = action === "Edit"
    const { t, i18n } = useTranslation()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
          <div className="pol-crash-form-column">
              <label>{t('Email Address')}</label>
              <TextField type="text" name="email" value={model.email} onChange={handleInputChange} disabled={edit} style={{ width: '100%' }} size='small' />
          </div>
          <div className="pol-crash-form-column">
              <label>{t('Username')}</label>
              <TextField type="text" name="userName" value={model.userName} onChange={handleInputChange} disabled={edit} style={{ width: '100%' }} size='small' />
          </div>
          <div className="pol-crash-form-column">
              <label>{t('Role')}</label>
              <select name="role" value={model.role} onChange={handleInputChange} disabled={edit} style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
                  <option value={USER_ROLE.ADMIN}>{t('Admin')}</option>
                  <option value={USER_ROLE.USER}>{t('User')}</option>
                  <option value={USER_ROLE.DEALER}>{t('Car Dealer')}</option>
                  <option value={USER_ROLE.INSURANCE}>{t('Insurance Company')}</option>
                  <option value={USER_ROLE.MANUFACTURER}>{t('Manufacturer')}</option>
                  <option value={USER_ROLE.POLICE}>{t('Police')}</option>
                  <option value={USER_ROLE.REGISTRY}>{t('Vehicle Registry Department')}</option>
                  <option value={USER_ROLE.SERVICE}>{t('Service Shop')}</option>
              </select>
          </div>
      </>
  );
}

export default UserModalAccountPage;

