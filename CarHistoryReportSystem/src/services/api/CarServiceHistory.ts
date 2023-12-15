import axios, { AxiosError } from "axios";
import { APIResponse, CarSalesInfo, CarServiceHistory, CarServices, RecallStatus, ServiceSearchParams } from "../../utils/Interfaces";

export async function ListServiceShopHistory(UserID: string, token: string, pageNumber: number, connectAPIError: string, language: string, searchParams: ServiceSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarServiceHistory/user/${UserID}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    CarId: searchParams.carId,
                    ServiceTimeStart: searchParams.serviceTimeStart,
                    ServiceTimeEnd: searchParams.serviceTimeEnd
                }
            })
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination']) }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function ListServices(): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarServiceHistory/service-list`)
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

export async function CreateServiceHistory(data: CarServiceHistory, token: string, connectAPIError: string, language: string) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarServiceHistory`, data,
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
        console.log("Add Error!: ", error)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function EditCarServices(data: CarServices, token: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarServiceHistory/${data.id}`,
            {
                ...data,
            },
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
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function GetCarRecalls(CarId: string, token:string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarRecall/status/car/${CarId}?Status=Open`,
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
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function UpdateCarRecallStatus(CarId: string, recallId: number, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarRecall/status/${CarId}/${recallId}`,
            {
                status: 1,
            },
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
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}