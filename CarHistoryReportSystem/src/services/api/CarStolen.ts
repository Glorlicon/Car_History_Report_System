import axios, { AxiosError } from "axios"
import { APIResponse, CarStolen, CarStolenSearchParams } from "../../utils/Interfaces"

export async function ListCarStolen(dataprovider: number, token: string, pageNumber: number, connectAPIError: string, language: string, carStolenSearchParams: CarStolenSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarStolenHistory/data-provider/${dataprovider}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    VinId: carStolenSearchParams.vinID,
                    Status: carStolenSearchParams.status,
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

export async function ListCarStolenInsurance(token: string, pageNumber: number, connectAPIError: string, language: string, carStolenSearchParams: CarStolenSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarStolenHistory/insurance-own`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    VinId: carStolenSearchParams.vinID,
                    Status: carStolenSearchParams.status,
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
export async function GetStolenInsuranceExcel(token: string, pageNumber: number, connectAPIError: string, language: string, carStolenSearchParams: CarStolenSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarStolenHistory/insurance-own`,
            {
                headers: {
                    'Accept': 'text/csv',
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    VinId: carStolenSearchParams.vinID,
                    Status: carStolenSearchParams.status,
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
export async function GetStolenExcel(dataprovider: number, token: string, pageNumber: number, connectAPIError: string, language: string, carStolenSearchParams: CarStolenSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarStolenHistory/data-provider/${dataprovider}`,
            {
                headers: {
                    'Accept': 'text/csv',
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    VinId: carStolenSearchParams.vinID,
                    Status: carStolenSearchParams.status,
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
export async function ImportStolenFromExcel(token: string, data: FormData, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarStolenHistory/collection/from-csv`, data,
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
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}
export async function DownloadStolenExcelFile(token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarStolenHistory/collection/from-csv/form`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Encoding': 'gzip',
                    'Content-Disposition': 'attachment;filename=data_01_12_2023.csv',
                    'Content-Language': 'en-US'
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
export async function AddCarStolenHistory(data: CarStolen, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarStolenHistory`,
            {
                ...data,
                status: Number(data.status)
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

export async function EditCarStolenHistory(id: number, data: CarStolen, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarStolenHistory/${id}`,
            {
                ...data,
                status: Number(data.status)
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