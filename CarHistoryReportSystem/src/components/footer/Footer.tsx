import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';
import '../../styles/Footer.css'

const Footer: React.FC = () => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&#169; 2023 SEP490_G6. {t('All rights reserved')}.</p>
                <div className="contact-info">
                    <p><strong>{t('Address')}:</strong> {t('FPT University, Ha Noi, Vietnam')}</p>
                    <p><strong>Email:</strong>se.group6.chrs@gmail.com</p>
                    <p><strong>{t('Phone')}:</strong> +1 (123) 456-7890</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;