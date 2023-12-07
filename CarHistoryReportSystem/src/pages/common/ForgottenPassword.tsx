import React, { useState } from 'react';
import { ForgotPassword, Login } from '../../services/auth/Login';
import '../../styles/ForgotPassword.css'
import { useDispatch, useSelector } from 'react-redux';
import { LoginResponse, VerifyToken } from '../../utils/Interfaces';
import { setToken, setUserData, setVerifyToken } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { SendVerifyToken } from '../../services/auth/Verify';

function ForgottenPassword() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [authenticationError, setAuthenticationError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReturn = () => {
        navigate('/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthenticationError(false)
        setErrorMessage("")
        setIsLoading(true);
        const response = await ForgotPassword({
            email: email,
        })
        setIsLoading(false);
        if (response.error) {
            setAuthenticationError(true)
            setErrorMessage(response.error as string)
        } else {
            navigate("/forgotpassword/initiate/" + {email})
        }
    };
    return (
        <div className="account-search-container">
            <div className="account-search-form">
                <form onSubmit={handleSubmit}>
                    <h2>Reset Your Password</h2>
                <p>Please enter your email address or mobile number to search for your account.</p>
                <input
                    type="text"
                    className="account-search-input"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                />
                {authenticationError && (
                    <div className="error message">{errorMessage}</div>
                )}
                {isLoading ? (
                    <div className="logging-in"></div>
                ) : (
                   <div className="account-search-actions">
                        <button type="button" onClick={handleReturn} className="account-search-cancel">Cancel</button>
                        <button type="submit" className="account-search-submit" >Search</button>
                   </div>
                )}
                </form>
            </div>
        </div>


    );
}

export default ForgottenPassword;