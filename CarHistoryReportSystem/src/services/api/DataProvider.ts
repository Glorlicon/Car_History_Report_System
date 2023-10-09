import axios, { AxiosError } from "axios"
import { Token } from "typescript"
import { DATA_PROVIDERS } from "../../utils/const/DataProviderTypes"
import { APIResponse, Manufacturer } from "../../utils/Interfaces"

export async function ListDataProviderTypes(token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/types-list`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
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

export async function List(token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/type/${DATA_PROVIDERS.Manufacturer}/no-user`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
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

export async function AddManufacturer(types: string[], data: Manufacturer, token: string): Promise<APIResponse> {
    const manufacturer = types.findIndex((x: string) => x === "Manufacturer")
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider`,
            {
                ...data,
                type: manufacturer
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
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            return { error: "Something went wrong. Please try again" }
        }
    }
}

export async function EditManufacturer(data: Manufacturer, token: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/${data.id}`, data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
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