import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../styles/PoliceHomepage.css'

function VehicleRegistryHomePage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <div className="police-home-container">
          <h1 className="police-home-header">{t('Vehicle Registry Services')}</h1>
          <div className="police-features">
              <div className="feature-card">
                  <h2>{t('Car Inspection')}</h2>
                  <p>{t('Ensure your vehicle meets all safety standards and is roadworthy with our comprehensive inspection services.')}</p>
              </div>
              <div className="feature-card">
                  <h2>{t('Car Registration')}</h2>
                  <p>{t('Register your vehicle quickly and easily. Link your car to your name with our streamlined registration process.')}</p>
              </div>
              <div className="feature-card">
                  <h2>{t('Real-Time Vehicle Monitoring')}</h2>
                  <p>{t('Keep track of all registered vehicles in real-time, ensuring up-to-date information for efficient management and oversight.')}</p>
              </div>
          </div>
          <section className="tools-section">
              <h2>{t('Tools that work for you')}</h2>
              <div className="tool-card-container">
                  <div className="tool-card">
                      <h3>{t('Detailed Inspection Reports')}</h3>
                      <p>{t('Generate and access detailed inspection reports to ensure every vehicle meets road safety standards.')}</p>
                      <button className="btn" onClick={() => navigate("/registry/inspection")}>{t('View Reports')}</button>
                  </div>
                  <div className="tool-card">
                      <h3>{t('Efficient Registration Process')}</h3>
                      <p>{t('Streamline your vehicle registration process with our efficient and user-friendly system.')}</p>
                      <button className="btn" onClick={() => navigate("/registry/registration")}>{t('Start Registration')}</button>
                  </div>
              </div>
          </section>
      </div>
  );
}

export default VehicleRegistryHomePage;