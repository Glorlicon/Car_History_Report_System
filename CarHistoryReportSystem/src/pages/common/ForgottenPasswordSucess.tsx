import React, { useEffect, useState } from 'react';
import { ForgotPassword, Login, ResetUserPassword } from '../../services/auth/Login';
import '../../styles/ForgotPassword.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../store/State';
import { useTranslation } from 'react-i18next';

function ForgottenPasswordSuccess() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const searchParams = new URLSearchParams(location.search);
    let token = searchParams.get('token');
    let email = searchParams.get('email');
    let UserEmail = '';
    let UserToken = '';
    const [authenticationError, setAuthenticationError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (token && email === null) {
        const emailIndex = token.indexOf('?email=');
        if (emailIndex !== -1) {
            UserEmail = token.substring(emailIndex + 7);
            UserToken = token.substring(0, emailIndex);
        }
    }
    const ResetPassword = async (email: string, token: string) => {
        setAuthenticationError(false)
        setErrorMessage("")
        setIsLoading(true);
        const response = await ResetUserPassword({
            token: token,
            email: email
        })
        setIsLoading(false);
        if (response.error) {
            setAuthenticationError(true)
            setErrorMessage(response.error as string)
        }
    };
    useEffect(() => {
        ResetPassword(UserEmail, UserToken)
        i18n.changeLanguage(currentLanguage)
    }, [])
    return (
        <div className="account-search-container">
            <div className="account-search-form">
                <h2>{t('Reset Your Password')}</h2>
                {authenticationError ? (
                    <div className="error message">{errorMessage}</div>
                ) : (
                    <p></p>
                )}
            </div>
        </div>


    );
}

export default ForgottenPasswordSuccess;