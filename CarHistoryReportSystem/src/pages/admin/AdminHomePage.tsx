import React, { useEffect, useState } from 'react';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../styles/PoliceHomepage.css'
function AdminHomePage() {
    const data = useSelector((state: RootState) => state.auth.token)
    const decoded = JWTDecoder(data as unknown as string)
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <div className="police-home-container">
            <h1 className="admin-home-header">
                {t('Comprehensive Control for System Administration')}
            </h1>
            <div className="police-features">
                <div className="feature-card">
                    <h2>{t('User Management')}</h2>
                    <p>{t('Oversee user activity, manage permissions and roles, ensuring a secure and efficient system environment.')}</p>
                </div>
                <div className="feature-card">
                    <h2>{t('Model Cataloging')}</h2>
                    <p>{t('Maintain an up-to-date car model database, ensuring all model specifications are current and accurate.')}</p>
                </div>
                <div className="feature-card">
                    <h2>{t('Data Provider Oversight')}</h2>
                    <p>{t('Monitor data flow, verify provider credentials, and manage data access to ensure integrity and reliability.')}</p>
                </div>
                <div className="feature-card">
                    <h2>{t('Request Handling')}</h2>
                    <p>{t('Efficiently process and respond to user requests, maintaining high service levels and user satisfaction.')}</p>
                </div>
                <div className="feature-card">
                    <h2>{t('Monetization Strategies')}</h2>
                    <p>{t('Develop and implement monetization strategies, optimizing revenue while maintaining user trust and compliance.')}</p>
                </div>
            </div>
            <section className="tools-section">
                <h2>{t('Tools that work for you')}</h2>
                <div className="tool-card-container">
                    <div className="tool-card">
                        <h3>{t('Manage Users')}</h3>
                        <p>{t('Assign roles, set permissions and manage user accounts to maintain system security and efficiency.')}</p>
                        <button className="btn" onClick={() => navigate("/admin/users")}>{t('Manage Now')}</button>
                    </div>
                    <div className="tool-card">
                        <h3>{t('Update Model List')}</h3>
                        <p>{t('Keep the car model list current with the latest data, ensuring accuracy across the platform.')}</p>
                        <button className="btn" onClick={() => navigate("/admin/car-models")}>{t('Update Models')}</button>
                    </div>
                    <div className="tool-card">
                        <h3>{t('Data Providers Control')}</h3>
                        <p>{t('Control and verify the data providers to maintain a reliable and authoritative system of information.')}</p>
                        <button className="btn" onClick={() => navigate("/admin/dataproviders")}>{t('Manage Providers')}</button>
                    </div>
                    <div className="tool-card">
                        <h3>{t('Review Requests')}</h3>
                        <p>{t('Assess and respond to requests from users and stakeholders, ensuring operational excellence.')}</p>
                        <button className="btn" onClick={() => navigate("/admin/requests")}>{t('Review Requests')}</button>
                    </div>
                    <div className="tool-card">
                        <h3>{t('Financial Insights')}</h3>
                        <p>{t('Analyze and track monetization outcomes, making data-driven decisions to enhance profitability.')}</p>
                        <button className="btn" onClick={() => navigate("/admin/monetization")}>{t('View Insights')}</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AdminHomePage;