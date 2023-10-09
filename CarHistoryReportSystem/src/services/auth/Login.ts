import axios, { AxiosError } from 'axios'
import { APIResponse } from '../../utils/Interfaces'

interface LoginData {
    username: string
    password: string
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