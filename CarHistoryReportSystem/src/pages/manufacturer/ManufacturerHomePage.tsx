import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../styles/PoliceHomepage.css'
function ManufacturerHomePage() {
        const { t, i18n } = useTranslation();
        const navigate = useNavigate()
        const currentLanguage = useSelector((state: RootState) => state.auth.language);
        const token = useSelector((state: RootState) => state.auth.token) as unknown as string
        useEffect(() => {
            i18n.changeLanguage(currentLanguage)
        }, []);
  return (
      <div className="police-home-container">
          <h1 className="manufacturer-home-header">
              {t('Innovative Solutions for Vehicle Manufacturing and Management')}
          </h1>
          <div className="police-features">
              <div className="feature-card">
                  <h2>{t('Model Management')}</h2>
                  <p>{t('Efficiently manage and update your car models, ensuring accurate and up-to-date information for users and regulatory bodies.')}</p>
              </div>
              <div className="feature-card">
                  <h2>{t('Recall Alerts')}</h2>
                  <p>{t('Instantly notify users and dealers about recalls, ensuring swift action for safety and compliance.')}</p>
              </div>
          </div>
          <section className="tools-section">
              <h2>{t('Tools that work for you')}</h2>
              <div className="tool-card-container">
                  <div className="tool-card">
                      <h3>{t('Model Registration')}</h3>
                      <p>{t('Register new car models in the system, complete with all relevant details for effective tracking and management.')}</p>
                      <button className="btn" onClick={() => navigate("/manufacturer/car-models")}>{t('Register Model')}</button>
                  </div>
                  <div className="tool-card">
                      <h3>{t('Issue Recall')}</h3>
                      <p>{t('Initiate a recall for specific models, providing detailed information and instructions for dealers and users.')}</p>
                      <button className="btn" onClick={() => navigate("/manufacturer/recalls")}>{t('Initiate Recall')}</button>
                  </div>
              </div>
          </section>
      </div>
  );
}

export default ManufacturerHomePage;