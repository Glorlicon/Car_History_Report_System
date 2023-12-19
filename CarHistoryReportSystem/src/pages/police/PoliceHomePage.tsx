import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../styles/PoliceHomepage.css'
function PoliceHomePage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <div className="police-home-container">
          <h1 className="police-home-header">{t('Unique insights and solutions for law enforcement')}</h1>
          <div className="police-features">
              <div className="feature-card">
                  <h2>{t('Partial Plate Search')}</h2>
                  <p>{t('Unlock rapid vehicle identification with our partial Plate search tool, aiding swift investigative action and follow-up.')}</p>
              </div>
              <div className="feature-card">
                  <h2>{t('VIN Alert System')}</h2>
                  <p>{t('Stay ahead with real-time alerts on vehicles of interest. Our VIN alert system provides critical updates that can pivot investigations.')}</p>
              </div>
              <div className="feature-card">
                  <h2>{t('Accident Reporting Simplified')}</h2>
                  <p>{t('Streamline accident reporting with our comprehensive digital tools, designed to capture and manage details with precision for better analysis.')}</p>
              </div>
              <div className="feature-card">
                  <h2>{t('Stolen Vehicle Tracking')}</h2>
                  <p>{t('Leverage our platform to report and track stolen vehicles efficiently, supporting faster recovery and closure of cases.')}</p>
              </div>
          </div>
          <section className="tools-section">
              <h2>{t('Tools that work for you')}</h2>
              <div className="tool-card-container">
                  <div className="tool-card">
                      <h3>{t('Partial Plate Search')}</h3>
                      <p>{t('Quickly search and identify vehicles with partial Plate numbers, aiding in efficient case resolution.')}</p>
                      <button className="btn" onClick={() => navigate("/police/plate-search")}>{t('Search Now')}</button>
                  </div>
                  <div className="tool-card">
                      <h3>{t('VIN Alert')}</h3>
                      <p>{t('Set up alerts for VIN numbers to track vehicle status and get notified of any changes or updates.')}</p>
                      <button className="btn" onClick={() => navigate("/police/vin-alert")}>{t('Set Alert')}</button>
                  </div>
                  <div className="tool-card">
                      <h3>{t('Crash Report Log')}</h3>
                      <p>{t('Create detailed vehicle crash reports and maintain accurate historical records for investigative purposes.')}</p>
                      <button className="btn" onClick={() => navigate("/police/crash")}>{t('Add Report')}</button>
                  </div>
                  <div className="tool-card">
                      <h3>{t('Stolen Vehicle Reports')}</h3>
                      <p>{t('Report and manage stolen vehicle cases within a unified system to support recovery and legal processes.')}</p>
                      <button className="btn" onClick={() => navigate("/police/stolen")}>{t('Report Theft')}</button>
                  </div>
              </div>
          </section>
      </div>
  );
}

export default PoliceHomePage;