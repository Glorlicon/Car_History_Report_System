import axios, { AxiosError } from 'axios'
import { useSelector } from 'react-redux'
import { APIResponse } from '../../utils/Interfaces'

interface VerifyData {
    code: string
    token: string
    email: string
}

interface ResendTokenData {
    userName: string
    password: string
    email: string
}
interface ResendEmailTokenData {
    email: string
}

export async function VerifyEmail(data: VerifyData): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Authentication/confirm-email`,data)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Cannot connect to server. Please try again." }
        } else {
            return { error: "Verification code is incorrect." }
        }
    }
}

export async function ResendCode(data: ResendEmailTokenData): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Authentication/resend-email-code`, data)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Cannot connect to server. Please try again." }
        } else {
            return { error: "Something went wrong while sending code. Please try again" }
        }
    }
}

export async function SendVerifyToken(data: ResendTokenData): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Authentication/resend-email-confirm-token`, data)
        console.log("Response: ", response.data)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Cannot connect to server. Please try again." }
        } else {
            return { error: "Something went wrong while sending code. Please try again" }
        }
    }
}