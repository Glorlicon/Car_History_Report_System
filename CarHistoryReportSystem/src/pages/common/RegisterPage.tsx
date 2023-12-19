import React, { FormEvent, useState } from 'react';
import AccountForm from '../../components/forms/register/AccountForm';
import UserForm from '../../components/forms/register/UserForm';
import useMultistepForm from '../../utils/useMultistepForm';
import '../../styles/RegisterPage.css'
import { registerUser } from '../../services/auth/Register';
import { USER_ROLE } from '../../utils/const/UserRole';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData, setVerifyToken } from '../../store/authSlice';
import { useTranslation } from 'react-i18next';

type RegisterData = {
    email: string
    username: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
    phoneNumber: string
}

const INITIAL_DATA: RegisterData = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
}

type ValidationErrors = {
    errors: string[]
}

const INITIAL_ERRORS: ValidationErrors = {
    errors: []
}

function RegisterPage() {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState(INITIAL_DATA)
    const [valid, setValid] = useState(false)
    const [shake, setShake] = useState(false)
    const [registerError, setRegisterError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate()
    const dispatch = useDispatch()
    function updateFiedls(fields: Partial<RegisterData>) {
        setData(prev => {
            return { ...prev, ...fields }
        })
    }


    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
        useMultistepForm([
            <UserForm {...data} updateFields={updateFiedls} setValid={setValid} shake={shake} />,
            <AccountForm {...data} updateFields={updateFiedls} setValid={setValid} shake={shake} />,
        ])
    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setErrorMessage("")
        if (!valid) {
            setShake(true)
            setTimeout(() => setShake(false), 300)
            return
        }
        if (!isLastStep) return next()
        setIsLoading(true);
        const response = await registerUser({
            ...data,
            role: USER_ROLE.USER
        })
        setIsLoading(false)

        if (!response.error) {
            const userData = dispatch(setUserData({ email: data.email, password: data.password }))
            const verifyToken = dispatch(setVerifyToken(response.data.verifyToken))
            navigate("/account-verify")
        }
        setRegisterError(true)
        setErrorMessage(response.error as string)
    }
    //TODO: fix css
    return (
        <div className="register-container">
            <form onSubmit={onSubmit} className="register-form">
                <h2 style={{borderBottom:'1px solid gray'}}>{t('Register')}</h2>
                <div className="register-pages">
                    {currentStepIndex + 1} / {steps.length}
                </div>
                {step}

                <div className="validation">
                    {registerError && (
                        <div className="error">{errorMessage}</div>
                    )}
                </div>
                {isLoading ? (
                    <div className="logging"></div>
                ) : (
                        <div className="register-buttons">
                            {!isFirstStep && (
                                <button type="button" onClick={() => { setRegisterError(false); back(); }}>
                                    Back
                                </button>
                            )}
                            <button type="submit">{isLastStep ? "Register" : "Next"}</button>
                        </div>
                )}
            </form>
        </div>
    );
}

export default RegisterPage;