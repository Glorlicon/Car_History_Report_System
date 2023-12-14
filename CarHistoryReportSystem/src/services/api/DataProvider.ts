import axios, { AxiosError } from "axios"
import { Token } from "typescript"
import { DATA_PROVIDERS } from "../../utils/const/DataProviderTypes"
import { APIResponse, CarSalesInfo, DataProvider, DataProviderSearchParams, Manufacturer, ManufacturerSearchParams } from "../../utils/Interfaces"

export async function ListDataProviderTypes(token: string, connectAPIError: string, unknownError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/types-list`,
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
            return { error: unknownError }
        }
    }
}

export async function List(token: string, pageNumber: number, connectAPIError: string, unknownError: string, language: string, searchParams: DataProviderSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    Name: searchParams.name,
                    Email: searchParams.email,
                    Type: searchParams.role
                }
            }
        )
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination']) }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}

export async function ListManu(token: string, pageNumber: number, connectAPIError: string, unknownError: string, language: string, searchParams: ManufacturerSearchParams, pageSize?: number): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/type/${DATA_PROVIDERS.Manufacturer}/no-user`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    Name: searchParams.name,
                    Email: searchParams.email,
                    PageSize: pageSize ? pageSize : 100000
                }
            }
        )
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}


export async function AddDataProvider(data: DataProvider, token: string, connectAPIError: string, unknownError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider`,
            {
            ...data,
            type: Number(data.type)
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
        console.log(axiosError)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}

export async function EditDataProvder(data: DataProvider, token: string, connectAPIError: string, unknownError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/${data.id}`,
            {
                ...data,
                type: Number(data.type)
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
        console.log(axiosError)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}
