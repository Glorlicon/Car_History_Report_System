import { TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { COLORS } from '../../../utils/const/Colors';
import { AdminRequest, Car, UserNotification, UsersRequest } from '../../../utils/Interfaces';
import Textarea from '@mui/joy/Textarea';

interface NotificationCharacteristicFormProps {
    model: UserNotification,
}
const RequestCharacteristicPage: React.FC<NotificationCharacteristicFormProps> = ({
    model,
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
          <div className="pol-crash-form-column">
              <label>{t('Title')}</label>
              <TextField type="text" name="tile" value={model.notification.title} disabled style={{ width: '100%' }} size='small' />
          </div>
          <div className="pol-crash-form-column">
              <label>{t('Description')}</label>
              <TextField type="text" name="description" value={model.notification.description} disabled style={{ width: '100%' }} size='small' />
          </div>
          <div className="pol-crash-form-column">
              <label>{t('Date')}</label>
              <TextField
                  type="text"
                  name="createdTime"
                  value={model.notification.createdTime ? new Date(model.notification.createdTime).toLocaleDateString() : ''}
                  disabled
                  style={{ width: '100%' }}
                  size="small"
              />
          </div>
          
      </>
  );
}



export default RequestCharacteristicPage;