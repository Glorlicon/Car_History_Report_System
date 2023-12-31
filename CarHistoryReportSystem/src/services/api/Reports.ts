import axios, { AxiosError } from "axios";
import { AddReport, APIResponse, Order } from "../../utils/Interfaces";

export async function GetReport(vin: string, token: string, date: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarReport/${vin}/${date}`,
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
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}


export async function CreateOrder(data: any, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Orders`, data,{
            headers:{
                'Accept-Language': `${language}`
            }
        })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            console.log(axiosError)
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function AddUserReport(reportData: AddReport, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    console.log(reportData)
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarReport`, reportData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`
                }
            })
        return { data: response.data}
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            console.log(axiosError)
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function CheckReportExist(reportData: AddReport, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    const date = new Date().toISOString().split('T')[0]
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarReport/${reportData.carId}/${reportData.userId}/${date}`,
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
        }  else  {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function GetUserReports(id: string, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarReport/user/${id}`,
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
            console.log(axiosError)
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}