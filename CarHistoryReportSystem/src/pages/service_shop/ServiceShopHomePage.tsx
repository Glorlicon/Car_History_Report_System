import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../styles/PoliceHomepage.css'
function ServiceShopHomePage() {
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
                {t('Essential Service Shop Solutions for Vehicle Care and Maintenance')}
            </h1>
            <div className="police-features">
                <div className="feature-card">
                    <h2>{t('Service Shop Detail')}</h2>
                    <p>{t('Access detailed information about your service shop, including services offered, hours of operation, and customer reviews.')}</p>
                </div>
                <div className="feature-card">
                    <h2>{t('Car Service List')}</h2>
                    <p>{t('View a list of vehicles serviced at your shop, track service history, and schedule upcoming maintenance appointments.')}</p>
                </div>
                <div className="feature-card">
                    <h2>{t('Car Recall Information')}</h2>
                    <p>{t('Stay informed about the latest vehicle recalls published by manufacturers to ensure timely service for your customers.')}</p>
                </div>
            </div>
            <section className="tools-section">
                <h2>{t('Insurance Tools for Your Needs')}</h2>
                <div className="tool-card-container">
                    <div className="tool-card">
                        <h3>{t('View Shop Details')}</h3>
                        <p>{t('Update and manage your service shop profile to accurately reflect your business capabilities and specialties.')}</p>
                        <button className="btn" onClick={() => navigate("/service/details")}>{t('Service Shop Detail')}</button>
                    </div>
                    <div className="tool-card">
                        <h3>{t('Serviced Cars')}</h3>
                        <p>{t('Manage your records of serviced vehicles, including detailed service logs, parts replaced, and service intervals.')}</p>
                        <button className="btn" onClick={() => navigate("/service/car-service")}>{t('Car Service List')}</button>
                    </div>
                    <div className="tool-card">
                        <h3>{t('Recall Notices')}</h3>
                        <p>{t('Review manufacturer recall notices to quickly identify affected vehicles and prepare for necessary repairs or parts replacements.')}</p>
                        <button className="btn" onClick={() => navigate("/service/recalls")}>{t('Car Recall')}</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ServiceShopHomePage;