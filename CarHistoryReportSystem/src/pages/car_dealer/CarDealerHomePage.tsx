import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../styles/PoliceHomepage.css'
function CarDealerHomePage() {
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
                {t('Comprehensive Car Dealership Solutions for Sales and Inventory Management')}
            </h1>
            <div className="police-features">
                <div className="feature-card">
                    <h2>{t('Dealer Profile')}</h2>
                    <p>{t('View and manage your dealership profile to ensure accurate presentation of your business to potential customers.')}</p>
                </div>
                <div className="feature-card">
                    <h2>{t('Cars for Sale')}</h2>
                    <p>{t('Showcase your current sales offerings with detailed listings, providing customers with up-to-date inventory and pricing.')}</p>
                </div>
                <div className="feature-card">
                    <h2>{t('Inventory Management')}</h2>
                    <p>{t('Efficiently manage your car inventory with comprehensive tools to track sales, purchases, and stock levels.')}</p>
                </div>
            </div>
            <section className="tools-section">
                <h2>{t('Insurance Tools for Your Needs')}</h2>
                <div className="tool-card-container">
                    <div className="tool-card">
                        <h3>{t('View Profile')}</h3>
                        <p>{t('Access your dealership’s profile to update contact information, opening hours, and service offerings.')}</p>
                        <button className="btn" onClick={() => navigate("/dealer/details")}>{t('Details')}</button>
                    </div>
                    <div className="tool-card">
                        <h3>{t('Sale Listings')}</h3>
                        <p>{t('Curate and publish your list of cars for sale, featuring detailed specifications, prices, and availability.')}</p>
                        <button className="btn" onClick={() => navigate("/dealer/cars")}>{t('Car For Sale List')}</button>
                    </div>
                    <div className="tool-card">
                        <h3>{t('Inventory Dashboard')}</h3>
                        <p>{t('Monitor your full inventory in real-time, with tools to add new stock, adjust pricing, and record sales transactions.')}</p>
                        <button className="btn" onClick={() => navigate("/dealer/storage")}>{t('Car Inventory')}</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CarDealerHomePage;