import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { VerifyEmail } from '../../services/auth/Verify';
import { RootState } from '../../store/State';

function AccountVeryficationPage() {
    const [code, setCode] = useState('')
    const [count, setCount] = useState(300)
    const [verificationError, setVerificationError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isVerifying, setVerifying] = useState(false)
    const [isResending, setResending] = useState(false)
    const data = useSelector((state: RootState) => state.auth.userData)
    const token = useSelector((state: RootState) => state.auth.verifyToken)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Data: ", data)
        console.log("Token: ", token)
        const response = await VerifyEmail({
            code: code ? code : "",
            token: token ? token : "",
            email: data.email ? data.email: ""
        })
        console.log(response)
    };

    const resentCode = async () => {
        setResending(true)

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
                        <a>Sending Code....</a>
                    ):(
                        <a onClick={resentCode} href='#'>Didn't received code? Resend Code</a>
                    )
                    }
                </div>
                <div className="error">
                    {verificationError && (
                        <div className="message">{errorMessage}</div>
                    )}
                </div>
                {isVerifying ? (
                    <div className="loading"></div>
                ) : (
                    <button type="submit">Verify</button>
                )}
            </form>
        </div>
    );
}

export default AccountVeryficationPage;