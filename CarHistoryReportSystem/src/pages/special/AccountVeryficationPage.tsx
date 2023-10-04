import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import '../../styles/VerifyPage.css'
import { ResendCode, VerifyEmail } from '../../services/auth/Verify';
import { RootState } from '../../store/State';

function AccountVeryficationPage() {
    const [code, setCode] = useState('')
    const [count, setCount] = useState(300)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isVerifying, setVerifying] = useState(false)
    const [isResending, setResending] = useState(false)
    const [resend, setResend] = useState(false)
    const [isVerified, setIsVerified] = useState(false);
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
            return
        }
        setError(true)
        setErrorMessage(response.error as string)
    };

    const resentCode = async () => {
        setResending(true)
        const response = await ResendCode({
            code: "",
            token: "",
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
                    <p>Your email has been successfully verified!</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="code-form">
                <h2>Registration veryfication</h2>
                <a>We have sent a veryfcation code to your registered email. Please verify it below.</a>
                <label htmlFor="code">Code</label>
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
                        <a onClick={resentCode} href='#'>Didn't received code? Resend Code</a>
                    )
                    }
                </div>
                {isResending ? (
                    <></>
                ): (
                       <div className="count">
                            {count} seconds until code expires!
                        </div>
                )}
                <div className="error">
                    {error && (
                        <div className="message">{errorMessage}</div>
                    )}
                </div>
                <div className="resend">
                    {resend && (
                        <div className="message-resend">Code has been resent to your email.</div>
                    )}
                </div>
                {(isVerifying || isResending) ? (
                    <div className="loading"></div>
                ) : (
                    <button type="submit">Verify</button>
                )}
            </form>
            )}
        </div>
    );
}

export default AccountVeryficationPage;