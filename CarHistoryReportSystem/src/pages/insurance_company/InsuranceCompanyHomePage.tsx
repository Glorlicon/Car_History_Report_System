import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../styles/PoliceHomepage.css'
function InsuranceCompanyHomePage() {
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
              {t('Tailored Insurance Solutions for Enhanced Vehicle Protection')}
          </h1>
          <div className="police-features">
              <div className="feature-card">
                  <h2>{t('Add Car Insurance')}</h2>
                  <p>{t('Provide comprehensive insurance options for new and used vehicles, offering peace of mind with robust coverage plans.')}</p>
              </div>
              <div className="feature-card">
                  <h2>{t('Stolen Vehicle Records')}</h2>
                  <p>{t('Access up-to-date information on stolen vehicles covered under your insurance policies to facilitate timely insurance actions and client communication.')}</p>
              </div>
              <div className="feature-card">
                  <h2>{t('Accident Oversight')}</h2>
                  <p>{t('Facilitate accident claims and management with detailed records and analysis of insured vehicles involved in accidents.')}</p>
              </div>
          </div>
          <section className="tools-section">
              <h2>{t('Insurance Tools for Your Needs')}</h2>
              <div className="tool-card-container">
                  <div className="tool-card">
                      <h3>{t('Policy Registration')}</h3>
                      <p>{t('Register and manage insurance policies for vehicles, streamlining the process for both insurers and clients.')}</p>
                      <button className="btn" onClick={() => navigate("/insurance/insurance-list")}>{t('Add Insurance')}</button>
                  </div>
                  <div className="tool-card">
                      <h3>{t('Stolen Vehicles')}</h3>
                      <p>{t('Access a comprehensive database of stolen vehicles to expedite claims processing and support recovery efforts.')}</p>
                      <button className="btn" onClick={() => navigate("/insurance/stolen")}>{t('View Stolen Cars')}</button>
                  </div>
                  <div className="tool-card">
                      <h3>{t('Crash Reports')}</h3>
                      <p>{t('Review and assess crash reports to determine coverage and assist in claims adjudication for insured vehicles.')}</p>
                      <button className="btn" onClick={() => navigate("/insurance/crash")}>{t('View Crash Reports')}</button>
                  </div>
              </div>
          </section>
      </div>
  );
}

export default InsuranceCompanyHomePage;