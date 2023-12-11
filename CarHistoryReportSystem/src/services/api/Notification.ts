import axios, { AxiosError } from "axios";
import { APIResponse, Car, CarSaleDetails, CarSaleSearchParams, CarSalesInfo, CarStorageSearchParams, UserNotificationRead } from "../../utils/Interfaces";

export async function GetUserNotification(id: string, pageNumber: number, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Notifications/user/${id}`,
            {
                headers: {
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber
                }
            })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}

export async function GetAllUserNotification(id: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Notifications/user/${id}`,
            {
                headers: {
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageSize: 99
                }
            })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}

export async function EditUserNotificationStatus(data: UserNotificationRead, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        console.log(data)
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Notifications/${data.notificationId}/${data.userId}`, data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`
                }
            }
        )
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log("Edit Error!: ", error)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}