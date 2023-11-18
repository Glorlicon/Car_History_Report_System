import React, { useState } from 'react';
import { Login } from '../../services/auth/Login';
import '../../styles/LoginPage.css'
import { useDispatch, useSelector } from 'react-redux';
import { LoginResponse, VerifyToken } from '../../utils/Interfaces';
import { setToken, setUserData, setVerifyToken } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { SendVerifyToken } from '../../services/auth/Verify';

function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authenticationError, setAuthenticationError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
                } else if (decodedData.roles === "PoliceOffice") {
                    navigate('/police')
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
    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="register-link">
                    <a href="/register"> Don't have an account? Register</a>
                </div>
                <div className="error">
                    {authenticationError && (
                        <div className="message">{errorMessage}</div>
                    )}
                </div>
                {isLoading ? (
                    <div className="logging"></div>
                ): (
                    <button type="submit">Login</button>
                )}
            </form>
        </div>
    );
}

export default LoginPage;