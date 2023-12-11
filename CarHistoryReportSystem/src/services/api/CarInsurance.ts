import axios, { AxiosError } from "axios"
import { APIResponse, CarInsurance, CarInsuranceSearchParams } from "../../utils/Interfaces"

export async function ListCarInsurance(dataprovider: number, token: string, pageNumber: number, connectAPIError: string, language: string, searchParams: CarInsuranceSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarInsurance/data-provider/${dataprovider}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    VinId: searchParams.vinID,
                    InsuranceNumber: searchParams.insuranceNumber,
                    StartStartDate: searchParams.startInsuranceDateMin,
                    StartEndDate: searchParams.startInsuranceDateMax,
                    EndStartDate: searchParams.endInsuranceDateMin,
                    EndEndDate: searchParams.endInsuranceDateMax
                }
            })
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination']) }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}
export async function GetInsuranceExcel(dataprovider: number, token: string, pageNumber: number, connectAPIError: string, language: string, searchParams: CarInsuranceSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarInsurance/data-provider/${dataprovider}`,
            {
                headers: {
                    'Accept': 'text/csv',
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    VinId: searchParams.vinID,
                    InsuranceNumber: searchParams.insuranceNumber,
                    StartStartDate: searchParams.startInsuranceDateMin,
                    StartEndDate: searchParams.startInsuranceDateMax,
                    EndStartDate: searchParams.endInsuranceDateMin,
                    EndEndDate: searchParams.endInsuranceDateMax
                }
            })
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination']) }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}
export async function ImportInsuranceFromExcel(token: string, data: FormData, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarInsurance/collection/from-csv`, data,
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
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}
export async function DownloadInsuranceExcelFile(token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarInsurance/collection/from-csv/form`,
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
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}

export async function AddCarInsurance(data: CarInsurance, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarInsurance`, data,
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
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}

export async function EditCarInsurance(id: number, data: CarInsurance, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarInsurance/${id}`, data,
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