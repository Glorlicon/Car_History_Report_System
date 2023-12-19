import axios, { AxiosError } from "axios"
import { APIResponse, CarInspectionHistory, CarInspectionSearchParams } from "../../utils/Interfaces"

export async function ListCarInspection(dataprovider: number, token: string, pageNumber: number, connectAPIError: string, language: string, carInspectionSearchParams: CarInspectionSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarInspectionHistory/data-provider/${dataprovider}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    CarId: carInspectionSearchParams.carId,
                    InspectionNumber: carInspectionSearchParams.inspectionNumber,
                    InspectionStartDate: carInspectionSearchParams.startDate,
                    InspectionEndDate: carInspectionSearchParams.endDate
                }
            })
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination'])}
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}
export async function GetInspectionExcel(dataprovider: number, token: string, pageNumber: number, connectAPIError: string, language: string, carInspectionSearchParams: CarInspectionSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarInspectionHistory/data-provider/${dataprovider}`,
            {
                headers: {
                    'Accept': 'text/csv',
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    CarId: carInspectionSearchParams.carId,
                    InspectionNumber: carInspectionSearchParams.inspectionNumber,
                    InspectionStartDate: carInspectionSearchParams.startDate,
                    InspectionEndDate: carInspectionSearchParams.endDate
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

export async function ImportInspectionFromExcel(token: string, data: FormData, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarInspectionHistory/collection/from-csv`, data ,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
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

export async function DownloadInpectionExcelFile(token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarInspectionHistory/collection/from-csv/form`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`
                }
            })
        return { data: response.data }
    } catch(error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            console.log(axiosError)
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}
export async function AddCarInspection(data: CarInspectionHistory, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarInspectionHistory`, data,
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

export async function EditCarInspection(id: string, data: CarInspectionHistory, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarInspectionHistory/${id}`, data,
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
