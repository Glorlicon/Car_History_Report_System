import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        const isEmailValid = isValidEmail(email);
        const isPasswordMatched = matchingPassword(password, confirmPassword);
        const isPasswordValid = isValidPassword(password);

        setValidEmail(isEmailValid);
        setMatchedPassword(isPasswordMatched);
        setValidPassword(isPasswordValid);

        setValid(isEmailValid && isPasswordMatched && isPasswordValid);
    }, [email, password, confirmPassword])


    return (
        <FormWrapper title="Account Details">
            <label>Username</label>
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
            <label>Password</label>
            <input
                required
                type="password"
                value={password}
                onChange={e => updateFields({ password: e.target.value })}
            />
            <label>Confirm Password</label>
            <input
                autoFocus
                required
                type="password"
                value={confirmPassword}
                onChange={e => updateFields({ confirmPassword: e.target.value })}
            />
            <div className={`${shake ? 'shaking' : 'validation'}`}>
                {!validEmail && (
                    <div className="error">Email is invalid!</div>
                )}
                {!validPassword && (
                    <div className="error">Password is not valid!</div>
                )}
                {!matchedPassword && (
                    <div className="error">Passwords are not matching!!</div>
                )}
            </div>
        </FormWrapper>
    )
}

export default AccountForm;