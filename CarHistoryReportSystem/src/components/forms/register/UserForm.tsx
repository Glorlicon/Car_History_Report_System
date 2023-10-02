import React from 'react';
import FormWrapper from './FormWrapper';

type UserData = {
    firstName: string
    lastName: string
    phoneNumber: string
}

type UserFormProps = UserData & {
    updateFields: (fields: Partial<UserData>) => void
}

function UserForm({
    firstName,
    lastName,
    phoneNumber,
    updateFields
}: UserFormProps) {
    return (
        <FormWrapper title="User Details">
            <label>First Name</label>
            <input
                autoFocus
                required
                type="text"
                value={firstName}
                onChange={e => updateFields({ firstName: e.target.value })}
            />
            <label>Last Name</label>
            <input
                required
                type="text"
                value={lastName}
                onChange={e => updateFields({ lastName: e.target.value })}
            />
            <label>Phone Number</label>
            <input
                autoFocus
                required
                type="text"
                value={phoneNumber}
                onChange={e => updateFields({ phoneNumber: e.target.value })}
            />
        </FormWrapper>
  );
}
//validate the phone number
export default UserForm;