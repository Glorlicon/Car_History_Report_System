import React, { useState } from 'react';
import { Login } from '../../services/auth/Login';
import '../../styles/LoginPage.css'
import { useDispatch, useSelector } from 'react-redux';
import { LoginResponse, Token } from '../../utils/Interfaces';
import { setToken } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { JWTDecoder } from '../../utils/JWTDecoder';

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
            if (data.isEmailVerified) {
                const token = dispatch(setToken(data.token))
                console.log("Token data:", JWTDecoder(data.token as string))
                navigate('/')
                //redirect to homepage + token
                return
            } else {
                console.log("Login verify: ", data.isEmailVerified)
                //redirect to email verify page
                return 
            }
        }
        setAuthenticationError(true)
        setErrorMessage(response.error)
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