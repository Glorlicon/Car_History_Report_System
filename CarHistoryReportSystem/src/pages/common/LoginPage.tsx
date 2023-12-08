import React, { useEffect, useState } from 'react';
import { Login } from '../../services/auth/Login';
import '../../styles/LoginPage.css'
import { useDispatch, useSelector } from 'react-redux';
import { LoginResponse, VerifyToken } from '../../utils/Interfaces';
import { setToken, setUserData, setVerifyToken } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { SendVerifyToken } from '../../services/auth/Verify';
import { t } from 'i18next';
import i18n from '../../localization/config';
import { RootState } from '../../store/State';

function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authenticationError, setAuthenticationError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    const handleCreateAccountClick = () => {
        navigate('/register');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthenticationError(false)
        setErrorMessage("")
        setIsLoading(true);
        const response = await Login({
            username: username,
            password: password
        })
        setIsLoading(false);
        if (!response.error) {
            const data = response.data as LoginResponse
            if (data.isSuspended) {
                navigate('/suspended')
                return
            }
            const dispatchToken = dispatch(setToken(data.token))
            if (data.isEmailVerified) {
                const decodedData = JWTDecoder(data.token as unknown as string)
                if (decodedData.roles === "Adminstrator") {
                    navigate('/admin')
                } else if (decodedData.roles === "Manufacturer") {
                    navigate('/manufacturer')
                } else if (decodedData.roles === "CarDealer") {
                    navigate('/dealer')
                } else if (decodedData.roles === "ServiceShop"){
                    navigate('/service')
                } else if (decodedData.roles === "PoliceOffice") {
                    navigate('/police')
                } else if (decodedData.roles === "VehicleRegistry") {
                    navigate('/registry')
                } else if (decodedData.roles === "InsuranceCompany") {
                    navigate('/insurance')
                } else {
                    navigate('/')
                }
                return
            } else {
                setIsLoading(true);
                const decodeJWTToken = JWTDecoder(data.token as string)
                const getVerifyToken = await SendVerifyToken({
                    userName: username,
                    password: password,
                    email: decodeJWTToken.email
                })
                setIsLoading(false);
                if (!getVerifyToken.error) {
                    const verifyData = getVerifyToken.data as VerifyToken
                    const decodedToken = JWTDecoder(data.token as string)
                    const dispatchUser = dispatch(setUserData({ email: decodedToken.email, password: password }))
                    const dispatchVerifyToken = dispatch(setVerifyToken(verifyData.token))
                    navigate("/account-verify")
                    return 
                }
                setAuthenticationError(true)
                setErrorMessage(getVerifyToken.error)
            }
        }
        setAuthenticationError(true)
        setErrorMessage(response.error as string)
    };

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [])

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>{t('Login')}</h2>
                <input
                    type="text"
                    id="username"
                    placeholder={t('Email address or username')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    placeholder={t('Password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {authenticationError && (
                    <div className="error message">{errorMessage}</div>
                )}
                {isLoading ? (
                    <div className="logging-in"></div>
                ) : (
                        <button type="submit" className="login-button">{t('Log in')}</button>
                )}
                <div className="login-form-footer">
                    <a href="/forgotpassword" className="forgot-password">{t('Forgotten password?')}</a>
                    <div className="divider"></div>
                    <button type="button" className="create-account-button" onClick={handleCreateAccountClick}>
                        {t('Create new account')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;