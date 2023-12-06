import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import '../../styles/Unauthorized.css'

function UnauthorizedPage() {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [])
  return (
      <div className="unauthorized-page">
          <h1>{t('Unauthorized')}</h1>
          <p>{t('UnauthorizedDesc1')}</p>
          <p>{t('UnauthorizedDesc2')}</p>
      </div>
  );
}

export default UnauthorizedPage;