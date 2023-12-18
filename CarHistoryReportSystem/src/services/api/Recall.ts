import axios, { AxiosError } from "axios";
import { APIResponse, CarModel, CarRecalls, CarRecallSearchParams, CarRegistrationSearchParams } from "../../utils/Interfaces";

export async function ListManufaturerCarModels(id: number, token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarRecall/manufacturer/${id}`,
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
            return { error: "Something went wrong. Please try again" }
        }
    }
}

export async function AddCarRecall(data: CarRecalls, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    console.log("Data: ", data)
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarRecall`,
            {
                ...data
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
        console.log("Add Error!: ", error)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function EditCarRecall(id: number, data: CarRecalls, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    console.log(token)
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarRecall/${id}`, data,
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
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function ListServiceShopCarRecall(token: string, pageNumber: number, connectAPIError: string, language: string, CarRecallSearchParams: CarRecallSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarRecall`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    ModelID: CarRecallSearchParams.modelId,
                    ExpireDateStart: CarRecallSearchParams.recallDateStart,
                    ExpireDateEnd: CarRecallSearchParams.recallDateEnd
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

export async function ListManufacturerRecallss(id: number, token: string, pageNumber: number, connectAPIError: string, language: string, CarRecallSearchParams: CarRecallSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarRecall/manufacturer/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    ModelID: CarRecallSearchParams.modelId,
                    RecallDateStart: CarRecallSearchParams.recallDateStart,
                    RecallDateEnd: CarRecallSearchParams.recallDateEnd
                }
            })
            console.log(response)
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

export async function AddCarRecalls(data: CarRecalls, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarRecall`, data,
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

export async function ImportRegistrationFromExcel(token: string, data: FormData, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarRegistrationHistory/collection/from-csv`, data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=--14737809831466499882746641449',
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