import axios, { AxiosError } from 'axios'
import { useSelector } from 'react-redux'
import { APIResponse } from '../../utils/Interfaces'

interface VerifyData {
    code: string
    token: string
    email: string
}

export async function VerifyEmail(data: VerifyData): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Authentication/confirm-email`,data)
        console.log("Verify :", response.data)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log(axiosError)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Cannot connect to server. Please try again." }
        } else {
            return { error: "Verifycation code is incorrect." }
        }
    }
}