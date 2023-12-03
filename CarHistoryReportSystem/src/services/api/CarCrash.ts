import axios, { AxiosError } from "axios"
import { APIResponse, CarCrash, CarCrashSearchParams } from "../../utils/Interfaces"

export async function ListCarCrash(dataprovider: number, token: string, pageNumber: number, connectAPIError: string, language: string, carCrashSearchParams: CarCrashSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarAccidentHistory/data-provider/${dataprovider}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    VinId: carCrashSearchParams.vinId,
                    MinServerity: carCrashSearchParams.minServerity,
                    MaxServerity: carCrashSearchParams.maxServerity,
                    AccidentStartDate: carCrashSearchParams.accidentStartDate,
                    AccidentEndDate: carCrashSearchParams.accidentEndDate
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
export async function ListCarCrashInsurance(token: string, pageNumber: number, connectAPIError: string, language: string, carCrashSearchParams: CarCrashSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarAccidentHistory/insurance-own`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    VinId: carCrashSearchParams.vinId,
                    MinServerity: carCrashSearchParams.minServerity,
                    MaxServerity: carCrashSearchParams.maxServerity,
                    AccidentStartDate: carCrashSearchParams.accidentStartDate,
                    AccidentEndDate: carCrashSearchParams.accidentEndDate
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

export async function GetCrashInsuranceExcel(token: string, pageNumber: number, connectAPIError: string, language: string, carCrashSearchParams: CarCrashSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarAccidentHistory/insurance-own`,
            {
                headers: {
                    'Accept': 'text/csv',
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    VinId: carCrashSearchParams.vinId,
                    MinServerity: carCrashSearchParams.minServerity,
                    MaxServerity: carCrashSearchParams.maxServerity,
                    AccidentStartDate: carCrashSearchParams.accidentStartDate,
                    AccidentEndDate: carCrashSearchParams.accidentEndDate
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
export async function GetCrashExcel(dataprovider: number, token: string, pageNumber: number, connectAPIError: string, language: string, carCrashSearchParams: CarCrashSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarAccidentHistory/data-provider/${dataprovider}`,
            {
                headers: {
                    'Accept': 'text/csv',
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    VinId: carCrashSearchParams.vinId,
                    MinServerity: carCrashSearchParams.minServerity,
                    MaxServerity: carCrashSearchParams.maxServerity,
                    AccidentStartDate: carCrashSearchParams.accidentStartDate,
                    AccidentEndDate: carCrashSearchParams.accidentEndDate
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

export async function ImportCrashFromExcel(token: string, data: FormData, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarAccidentHistory/collection/from-csv`, data,
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
export async function DownloadCrashExcelFile(token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarAccidentHistory/collection/from-csv/form`,
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

export async function AddCarCrash(data: CarCrash, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarAccidentHistory`, data,
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

export async function EditCarCrash(id: number, data: CarCrash, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    console.log(token)
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarAccidentHistory/${id}`, data,
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