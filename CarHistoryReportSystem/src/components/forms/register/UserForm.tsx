import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { isValidNumber } from '../../../utils/Validators';
import FormWrapper from './FormWrapper';
import MuiAlert from '@mui/material/Alert';
type UserData = {
    firstName: string
    lastName: string
    phoneNumber: string
}

type UserFormProps = UserData & {
    updateFields: (fields: Partial<UserData>) => void
    setValid: React.Dispatch<React.SetStateAction<boolean>>
    shake: boolean
}

function UserForm({
    firstName,
    lastName,
    phoneNumber,
    updateFields,
    setValid,
    shake
}: UserFormProps) {
    const [validNumber, setValidNumber] = useState(true)
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.auth.language);
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, []);
    useEffect(() => {
        const isNumberValid = isValidNumber(phoneNumber);
        setValidNumber(isNumberValid);
        setValid(isNumberValid);
    }, [phoneNumber])

    return (
        <FormWrapper title="User Details">
            <label>{t('First Name')}</label>
            <input
                autoFocus
                required
                type="text"
                value={firstName}
                onChange={e => updateFields({ firstName: e.target.value })}
            />
            <label>{t('Last Name')}</label>
            <input
                required
                type="text"
                value={lastName}
                onChange={e => updateFields({ lastName: e.target.value })}
            />
            <label>{t('Phone Number')}</label>
            <input
                autoFocus
                required
                type="text"
                value={phoneNumber}
                onChange={e => updateFields({ phoneNumber: e.target.value })}
            />
            <div className={` ${shake ? 'shaking' : 'validation'}`}>
                {!validNumber && (
                    <div className="error">{t('Phone number is not valid')}!!</div>
                )}
            </div>
        </FormWrapper>
    );
}
export default UserForm;