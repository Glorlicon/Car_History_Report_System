import axios, { AxiosError } from "axios"
import { APIResponse, CarRegistration } from "../../utils/Interfaces"

export async function ListCarRegistration(token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarRegistrationHistory`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}

export async function AddCarRegistration(data: CarRegistration, token: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarRegistrationHistory`,data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log("Add Error!: ", error)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}

export async function EditCarRegistration(carId: string, data: CarRegistration, token: string): Promise<APIResponse> {
    console.log(token)
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarRegistrationHistory/${carId}`,data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log("Edit Error!: ", error)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}