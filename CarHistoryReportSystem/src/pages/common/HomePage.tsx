import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import '../../styles/Homepage.css';
import Logo from '../../logoCHRS.png';
import CHRS_Report from '../../CHRS_Report.png';
import { useTranslation } from 'react-i18next';
import CHRS_Maintainance from '../../CHRS_Maintainance.png';
import { useNavigate } from 'react-router-dom';
function HomePage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
  return (
      <div className="home-container">
          <header className="home-header">
              <img className="homepage-logo" src={Logo} alt="Logo" />
              <h1>{t('Shopping for a Used Car?')}</h1>
              <div className="header-buttons">
                  <button className="btn btn-primary" onClick={() => navigate("/report")}>{t('Get CHRS Reports')}</button>
                  <span>{t('Or')}</span>
                  <button className="btn btn-secondary" onClick={() => navigate("/sales")}>{t('Find a Used Car')}</button>
              </div>
          </header>
          <section className="home-content">
              <div className="content-block">
                  <div className="image-content">
                      <img className="CHRS_Report" alt="report" src={CHRS_Report}></img>
                  </div>
                  <div className="text-content-right">
                      <h2>{t('CHRS Vehicle History Reports')}</h2>
                      <p>{t('Find out how much the car is really worth with every report.')}</p>
                      <button className="btn btn-primary" onClick={() => navigate("/report")}>{t('Get CHRS Reports')}</button>
                  </div>
              </div>
              <div className="content-block grey-background">
                  <div className="text-content-left">
                      <h2>{t('Car Maintenance: Simplified')}</h2>
                      <p>{t('Track maintenance and get reminders when your car is due for service.')}</p>
                      {
                          !token
                              ? (<button className="btn btn-primary" onClick={() => navigate("/register")}>{t('Sign up for FREE!')}</button>)
                              : (<button className="btn btn-primary" onClick={() => navigate("/maintainance")}>{t('Sign up for FREE!')}</button>)
                      }
                  </div>
                  <div className="image-content">
                      <img className="CHRS_Maintainance" src={CHRS_Maintainance} alt="maintainance" />
                  </div>
              </div>
              {/* Repeat content blocks as needed */}
          </section>
      </div>
  );
}

export default HomePage;