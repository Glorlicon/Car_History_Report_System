import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import '../../styles/VerifyPage.css'
import { ResendCode, VerifyEmail } from '../../services/auth/Verify';
import { RootState } from '../../store/State';
import { Login } from '../../services/auth/Login';
import { LoginResponse } from '../../utils/Interfaces';
import { clearUserData, setToken } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function AccountVeryficationPage() {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [code, setCode] = useState('')
    const [count, setCount] = useState(300)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isVerifying, setVerifying] = useState(false)
    const [isResending, setResending] = useState(false)
    const [resend, setResend] = useState(false)
    const [isVerified, setIsVerified] = useState(false);
    const [isLogin, setLogin] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const data = useSelector((state: RootState) => state.auth.userData)
    const token = useSelector((state: RootState) => state.auth.verifyToken)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifying(true)
        const response = await VerifyEmail({
            code: code ? code : "",
            token: token ? token : "",
            email: data.email ? data.email: ""
        })
        setVerifying(false)
        if (!response.error) {
            setVerifying(false)
            setIsVerified(true);
            setLogin(true);
            const login = await Login({
                username: data.email as unknown as string,
                password: data.password as unknown as string
            })
            setLogin(false)
            const clear = dispatch(clearUserData())
            if (!login.error) {
                setLoginSuccess(true)
                const data = login.data as LoginResponse
                console.log(data)
                const dispatchToken = dispatch(setToken(data.token))
                navigate('/')
                return
            }
            setLoginSuccess(false)
            return
        }
        setError(true)
        setErrorMessage(response.error as string)
    };

    const resentCode = async () => {
        setResending(true)
        const response = await ResendCode({
            email: data.email ? data.email : ""
        })
        setResending(false)
        if (!response.error) {
            setResend(true)
            setCount(300)
            return
        }
        setError(true)
        setErrorMessage(response.error as string)
    }

    useEffect(() => {
        if (count > 0) {
            const timer = setInterval(() => {
                setCount((prevCount) => prevCount - 1)
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [count])

    return (
        <div className="code-container">
            {isVerified ? (
                <div className="verification-success">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                    <p>{t('Your email has been successfully verified! Wait for a bit, we will try to login you to the system')}!</p>
                    {isLogin ? (
                        <div className="loading"></div>
                    ): (
                        <div className="error">
                            {!loginSuccess && (
                                    <div className="message">{t('Something went wrong when trying to login. Try to login manually')}.</div>
                            )}
                </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="code-form">
                <h2>{t('Registration veryfication')}</h2>
                <a>{t('We have sent a veryfcation code to your registered email. Please verify it below')}.</a>
                <label htmlFor="code">{t('Code')}</label>
                <input
                    type="text"
                    placeholder="Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <div className="resend-code">
                    {isResending ? (
                        <></>
                    ):(
                        <a onClick={resentCode} href='#'>{t("Didn't received code? Resend Code")}</a>
                    )
                    }
                </div>
                {isResending ? (
                    <></>
                ): (
                       <div className="count">
                            {count} {t('seconds until code expires')}!
                        </div>
                )}
                <div className="error">
                    {error && (
                        <div className="message">{errorMessage}</div>
                    )}
                </div>
                <div className="resend">
                    {resend && (
                        <div className="message-resend">{t('Code has been resent to your email')}.</div>
                    )}
                </div>
                {(isVerifying || isResending) ? (
                    <div className="loading"></div>
                ) : (
                    <button type="submit">{t('Verify')}</button>
                )}
            </form>
            )}
        </div>
    );
}

export default AccountVeryficationPage;