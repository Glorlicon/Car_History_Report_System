import axios, { AxiosError } from 'axios'
import { APIResponse } from '../../utils/Interfaces'

interface LoginData {
    username: string
    password: string
}

interface ForgotPasswordData {
    email: string
}

interface ResetPasswordData {
    token: string
    email: string
}

export async function Login(data: LoginData): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Authentication/login`, data)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log(axiosError)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            return { error: "Username/Email or Password is incorrect. Please check your credentials!" }
        }
    }
}

export async function ForgotPassword(data: ForgotPasswordData): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Authentication/forgot`, data)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log(axiosError)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            return { error: "Email doesn't exist in the system, please check carefully!" }
        }
    }
}

export async function ResetUserPassword(data: ResetPasswordData): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Authentication/reset`, data)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log(axiosError)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            return { error: "Something went wrong, please contact our support team!" }
        }
    }
}