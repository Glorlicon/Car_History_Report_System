import axios, { AxiosError } from "axios";
import { AddReport, APIResponse, Order } from "../../utils/Interfaces";

export async function GetReport(vin: string, token: string): Promise<APIResponse> {
    const date = new Date().toISOString().split('T')[0]
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarReport/${vin}/${date}`,
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
            console.log(axiosError)
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}

export async function GetReportExcel(vin: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarServiceHistory`,
            {
                headers: {
                    'Accept': 'text/csv'
                }
            })
        console.log("Response", response)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            console.log(axiosError)
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}

export async function CreateOrder(data: any): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Orders`, data)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            console.log(axiosError)
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}

export async function AddUserReport(reportData: AddReport, token: string): Promise<APIResponse> {
    console.log(reportData)
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarReport`, reportData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        return { data: "Success" }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            console.log(axiosError)
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}

export async function CheckReportExist(reportData: AddReport, token: string): Promise<APIResponse> {
    const date = new Date().toISOString().split('T')[0]
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarReport/${reportData.carId}/${reportData.userId}/${date}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        return { data: "Success" }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else if (axiosError.response?.status === 404) {
            return { data: "Report doesn't exist"}
        } else  {
            console.log(axiosError)
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}