import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/State';
import { COLORS } from '../../../../utils/const/Colors';
import { AdminRequest } from '../../../../utils/Interfaces';
import { REQUEST_STATUS } from '../../../../utils/const/RequestResponse';
import Textarea from '@mui/joy/Textarea';
import TextField from '@mui/material/TextField'

interface RequestAnsweringPageModal {
    action: "Add" | "Edit"
    model: AdminRequest
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}
const RequestAnsweringPage: React.FC<RequestAnsweringPageModal> = ({
    action,
    model,
    handleInputChange
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <>
          <div className="pol-crash-form-column">
              <label>{t('Status')}</label>
              <select name="status" onChange={handleInputChange} value={model.status ? model.status : REQUEST_STATUS.Approved} style={{ borderRadius: '5px', borderColor: 'gray', height: '40px' }}>
                  <option value={REQUEST_STATUS.Approved}>{t('Approved')}</option>
                  <option value={REQUEST_STATUS.Rejected} >{t('Rejected')}</option>
              </select>
          </div>
          <div className="pol-crash-form-column" >
              <label>{t('Response')}</label>
              <Textarea name="response" value={model?.response} onChange={handleInputChange} className="TextField" />
          </div>
      </>
  );
}

export default RequestAnsweringPage;