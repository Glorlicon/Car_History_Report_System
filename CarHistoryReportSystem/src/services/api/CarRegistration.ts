import axios, { AxiosError } from "axios"
import { APIResponse, CarRegistration, CarRegistrationSearchParams } from "../../utils/Interfaces"

export async function ListCarRegistration(dataprovider: number, token: string, pageNumber: number, connectAPIError: string, language: string, carRegistrationSearchParams: CarRegistrationSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarRegistrationHistory/data-provider/${dataprovider}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    CarId: carRegistrationSearchParams.carId,
                    OwnerName: carRegistrationSearchParams.ownerName,
                    RegistrationNumber: carRegistrationSearchParams.registrationNumber,
                    ExpireDateStart: carRegistrationSearchParams.expireDateStart,
                    ExpireDateEnd: carRegistrationSearchParams.expireDateEnd,
                    LicensePlateNumber: carRegistrationSearchParams.licensePlateNumber
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
export async function GetRegistrationExcel(dataprovider: number, token: string, pageNumber: number, connectAPIError: string, language: string, carRegistrationSearchParams: CarRegistrationSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarRegistrationHistory/data-provider/${dataprovider}`,
            {
                headers: {
                    'Accept': 'text/csv',
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    CarId: carRegistrationSearchParams.carId,
                    OwnerName: carRegistrationSearchParams.ownerName,
                    RegistrationNumber: carRegistrationSearchParams.registrationNumber,
                    ExpireDateStart: carRegistrationSearchParams.expireDateStart,
                    ExpireDateEnd: carRegistrationSearchParams.expireDateEnd,
                    LicensePlateNumber: carRegistrationSearchParams.licensePlateNumber
                }
            })
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination']) }
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
export async function ImportRegistrationFromExcel(token: string, data: FormData, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarRegistrationHistory/collection/from-csv`, data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
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
export async function DownloadRegistrationExcelFile(token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarRegistrationHistory/collection/from-csv/form`,
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
            console.log(axiosError)
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function AddCarRegistration(data: CarRegistration, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarRegistrationHistory`,data,
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

export async function EditCarRegistration(carId: string, data: CarRegistration, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    console.log(token)
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarRegistrationHistory/${carId}`,data,
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