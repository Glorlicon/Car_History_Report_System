import React from 'react';
import FormWrapper from './FormWrapper';

type CodeData = {
    code: string
}

type CodeFormProps = CodeData & {
    updateFields: (fields: Partial<CodeData>) => void
}


function CodeForm({
    code,
    updateFields
}: CodeFormProps) {
    return (
        <FormWrapper title="User Details">
            <h5 style={{
                textAlign: 'center'
            }}
            >We have sent an confirmation code to your email, please enter confirmation code to complete your registration</h5>
            <br/>
            <label>Confirmation Code</label>
            <br/>
            <input
                autoFocus
                required
                type="text"
                value={code}
                onChange={e => updateFields({ code: e.target.value })}
            />
        </FormWrapper>
    )
}

export default CodeForm;