import axios, { AxiosError } from "axios"
import { APIResponse } from "../../utils/Interfaces"

export async function ListDataProviderTypes(): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/types-list`)
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

export async function List(types: string[]): Promise<APIResponse> {
    const manufacturer = types.findIndex((x: string) => x === "Manufacturer")
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/type/${manufacturer}`)
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