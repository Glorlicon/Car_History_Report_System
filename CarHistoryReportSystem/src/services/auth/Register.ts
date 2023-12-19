import axios, { AxiosError } from 'axios'
import { APIResponse } from '../../utils/Interfaces'
interface RegisterData {
    email: string
    username: string
    password: string
    firstName: string
    lastName: string
    phoneNumber: string
    role: number
}

interface RegisterErrors {
    DuplicateEmail: string[]
    DuplicateUserName: string[]
}

export async function registerUser(data: RegisterData): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Authentication/register`, data)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log(axiosError)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else if (axiosError.code === "ERR_BAD_REQUEST") {
            const errors = axiosError.response?.data as RegisterErrors
            let message = ""
            if (errors.DuplicateEmail) {
                message += errors.DuplicateEmail[0] + " "
            }
            if (errors.DuplicateUserName) {
                message += errors.DuplicateUserName[0]
            }
            return { error: message }
        } else {
            return { error: "Something went wrong. Please try again" }
        }
    }
}