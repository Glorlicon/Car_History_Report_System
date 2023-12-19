import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import '../../styles/Suspend.css'

function SuspendPage() {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [])
  return (
      <div className="suspended-page">
          <h1>{t('Account Suspended')}</h1>
          <p>{t('Your account has been suspended due to violation of our terms of service')}.</p>
          <p>{t('If you believe this is a mistake or if you want to appeal, please contact our support team')}.</p>
      </div>
  );
}

export default SuspendPage;