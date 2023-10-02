import React from 'react';
import FormWrapper from './FormWrapper';

type AccountData = {
    email: string
    password: string
    confirmPassword: string
}

type AccountFormProps = AccountData & {
    updateFields: (fields: Partial<AccountData>) => void
}

function AccountForm({
    email,
    password,
    confirmPassword,
    updateFields
}: AccountFormProps) {
    return (
        <FormWrapper title="Account Details">
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
        </FormWrapper>
    )
}
// compare password to confirmPassword
export default AccountForm;