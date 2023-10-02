import React, { FormEvent, useState } from 'react';
import AccountForm from '../../components/forms/register/AccountForm';
import CodeForm from '../../components/forms/register/CodeForm';
import UserForm from '../../components/forms/register/UserForm';
import useMultistepForm from '../../utils/useMultistepForm';
import '../../styles/RegisterPage.css'
import { confirmPassword, isValidEmail, isValidNumber } from '../../utils/Validators';

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
    const [data, setData] = useState(INITIAL_DATA)
    const [errors, setErrors] = useState(INITIAL_ERRORS)
    function updateFiedls(fields: Partial<RegisterData>) {
        setData(prev => {
            return { ...prev, ...fields }
        })
    }

    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
        useMultistepForm([
            <UserForm {...data} updateFields={updateFiedls} />,
            <AccountForm {...data} updateFields={updateFiedls} />,
            /*<CodeForm {...data} updateFields={updateFiedls}/>*/
        ])

    function onSubmit(e: FormEvent) {
        e.preventDefault()
        let invalidData: ValidationErrors = {
            errors: []
        }
        if (!isValidEmail(data.email)) invalidData.errors.push("Email is invalid!!")
        if (!isValidNumber(data.phoneNumber)) invalidData.errors.push("Phone number is invalid!!")
        if (!confirmPassword(data.password, data.confirmPassword)) invalidData.errors.push("Passwords are not matching!!")

        if (!invalidData.errors) {
            if (!isLastStep) return next()
            console.log("Hello")
            alert("Success")
        } else {
            setErrors(invalidData)
        }
        console.log("Hello")
        console.log(invalidData.errors)
    }

    return (
        <div className="register-container">
            <form onSubmit={onSubmit} className="register-form">
                <div className="register-pages">
                    {currentStepIndex + 1} / {steps.length}
                </div>
                {step}
                <div className="register-buttons">
                    {!isFirstStep && (
                        <button type="button" onClick={back}>
                            Back
                        </button>
                    )}
                    <button type="submit">{isLastStep ? "Finish" : "Next"}</button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;