import React, { useEffect, useState } from 'react';
import { ForgotPassword, Login } from '../../services/auth/Login';
import '../../styles/ForgotPassword.css'
import { useDispatch, useSelector } from 'react-redux';
import { LoginResponse, VerifyToken } from '../../utils/Interfaces';
import { setToken, setUserData, setVerifyToken } from '../../store/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { JWTDecoder } from '../../utils/JWTDecoder';
import { SendVerifyToken } from '../../services/auth/Verify';
import { isValidEmail } from '../../utils/Validators';

function ForgottenPasswordInitiate() {
    type RouteParams = {
        email: string
    }
    const { email } = useParams<RouteParams>()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleReturn = () => {
        navigate('/login');
    };

    const checkEmail = (email: string) => {
        const checkEmail = (email: string) => {
            if (!isValidEmail(email)) {
                navigate('/forgotpassword');
            }
        }
    }
    useEffect(() => {
        checkEmail(email as string)
    }, [])

        return (
            <div className="account-search-container">
                <div className="account-search-form">
                    <h2>Reset Your Password</h2>
                    <p>We have sent you an email with the link to reset your password!</p>
                </div>
            </div>


        );
    }

export default ForgottenPasswordInitiate;