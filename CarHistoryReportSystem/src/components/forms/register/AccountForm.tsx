import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { isValidEmail, isValidPassword, matchingPassword } from '../../../utils/Validators';
import FormWrapper from './FormWrapper';

type AccountData = {
    username: string
    email: string
    password: string
    confirmPassword: string
}

type AccountFormProps = AccountData & {
    updateFields: (fields: Partial<AccountData>) => void
    setValid: React.Dispatch<React.SetStateAction<boolean>>
    shake: boolean
}

function AccountForm({
    username,
    email,
    password,
    confirmPassword,
    updateFields,
    setValid,
    shake
}: AccountFormProps) {
    const [validEmail, setValidEmail] = useState(false)
    const [matchedPassword, setMatchedPassword] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);

    useEffect(() => {
        const isEmailValid = isValidEmail(email);
        const isPasswordMatched = matchingPassword(password, confirmPassword);
        const isPasswordValid = isValidPassword(password);

        setValidEmail(isEmailValid);
        setMatchedPassword(isPasswordMatched);
        setValidPassword(isPasswordValid);

        setValid(isEmailValid && isPasswordMatched && isPasswordValid);
    }, [email, password, confirmPassword])

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    return (
        <FormWrapper title="Account Details">
            <label>{t('Username')}</label>
            <input
                autoFocus
                required
                type="text"
                value={username}
                onChange={e => updateFields({ username: e.target.value })}
            />
            <label>Email</label>
            <input
                autoFocus
                required
                type="text"
                value={email}
                onChange={e => updateFields({ email: e.target.value })}
            />
            <label>{t('Password')}</label>
            <input
                required
                type="password"
                value={password}
                onChange={e => updateFields({ password: e.target.value })}
            />
            <label>{t('Confirm Password')}</label>
            <input
                autoFocus
                required
                type="password"
                value={confirmPassword}
                onChange={e => updateFields({ confirmPassword: e.target.value })}
            />
            <div className={`${shake ? 'shaking' : 'validation'}`}>
                {!validEmail && (
                    <div className="error">{t('Email is invalid')}!</div>
                )}
                {!validPassword && (
                    <div className="error">{t('Password is not valid')}!</div>
                )}
                {!matchedPassword && (
                    <div className="error">{t('Passwords are not matching')}!</div>
                )}
            </div>
        </FormWrapper>
    )
}

export default AccountForm;