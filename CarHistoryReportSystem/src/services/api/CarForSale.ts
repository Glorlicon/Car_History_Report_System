import axios, { AxiosError } from "axios"
import { APIResponse, CarModel } from "../../utils/Interfaces"

export async function ListCarForSale(): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/selling`)
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