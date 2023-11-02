import axios, { AxiosError } from "axios"
import { APIResponse, Car, CarModel, ContactMail } from "../../utils/Interfaces"

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

export async function GetCarForSale(vinId: String): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/${vinId}`)
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

export async function SendContactMail(data: ContactMail): Promise<APIResponse> {
    try {
        //Bug Dataprovider tai khoan = null
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/contact`, data)
        console.log("Response: ", response.data)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Cannot connect to server. Please try again." }
        } else {
            return { error: "Something went wrong while sending code. Please try again" }
        }
    }
}