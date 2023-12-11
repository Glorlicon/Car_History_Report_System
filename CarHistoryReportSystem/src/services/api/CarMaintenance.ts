import axios, { AxiosError } from "axios";
import { APIResponse, CarMaintenance } from "../../utils/Interfaces";

export async function ListCarMaintenance(userId: string, token: string, connectAPIError: string, unknownError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarMaintainance/user/${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`
                }
            })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}

export async function AddCarMaintenance(data: CarMaintenance, token: string, connectAPIError: string,  language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarMaintainance/car-maintainance`, data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`
                }
            })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        }  else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function RemoveCarMaintenance(data: CarMaintenance, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/api/CarMaintainance/car-maintainance/car/${data.carId}/user/${data.userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`
                }
            })
        return { data: response.data }
    } catch (error) {
        //404 not exist
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function GetMaintenanceDetails(carId: string, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarMaintainance/${carId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                }
            })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function GetCarServiceHistory(vin: string, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarServiceHistory/car/${vin}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`
                },
                params: {
                    PageSize: 100000,
                    PageNumber: 1
                }
            })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}