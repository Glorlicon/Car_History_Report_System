import { TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { COLORS } from '../../../utils/const/Colors';
import { AdminRequest, Car, UserNotification, UsersRequest } from '../../../utils/Interfaces';

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
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <TextField
                      label={t('Title')}
                      defaultValue={model.notification.title}
                      InputProps={{
                          readOnly: true,
                          style: {
                              fontSize: 15,
                              width: 170
                          },
                      }}
                      multiline
                  />
              </div>
          </div>
          <div className="ad-car-form-columns">
              <div className="ad-car-form-column">
                  <TextField
                      label={t('Description')}
                      defaultValue={model.notification.description}
                      InputProps={{
                          readOnly: true,
                          style: {
                              fontSize: 15,
                              width: 250
                          },
                      }}
                      multiline
                  />
              </div>
              <div className="ad-car-form-column">
                  <TextField
                      label={t('Date')}
                      defaultValue={model.notification.createdTime}
                      InputProps={{
                          readOnly: true,
                          style: {
                              fontSize: 15,
                              width: 250
                          },
                      }}
                  />
              </div>
          </div>
          <div className="ad-car-form-column">
              
          </div>
          
      </>
  );
}



export default RequestCharacteristicPage;