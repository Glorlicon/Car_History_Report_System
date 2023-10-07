import axios, { AxiosError } from "axios";
import { APIResponse, User } from "../../utils/Interfaces";

interface CreateErrors {
    DuplicateEmail: string[]
    DuplicateUserName: string[]
}
export async function List(): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/User`)
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

export async function Add(data: User): Promise<APIResponse> {
    const verifiedData: User = { ...data, role: +data.role }
    console.log("verifiedData: ", verifiedData)
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/User`, verifiedData)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log("Add: ", axiosError)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else if (axiosError.code === "ERR_BAD_REQUEST") {
            const errors = axiosError.response?.data as CreateErrors
            let message = ""
            if (errors.DuplicateEmail) {
                message += errors.DuplicateEmail[0] + " "
            }
            if (errors.DuplicateUserName) {
                message += errors.DuplicateUserName[0]
            }
            return { error: message }
        } else {
            return { error: "Something went wrong. Please try again" }
        }
    }
} 

export async function Edit(id: string, data: User): Promise<APIResponse> {
    const verifiedData: User = { ...data, role: +data.role }
    console.log("verifiedData: ", verifiedData)
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/User/${id}`, verifiedData)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log("Add: ", axiosError)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else if (axiosError.code === "ERR_BAD_REQUEST") {
            const errors = axiosError.response?.data as CreateErrors
            let message = ""
            if (errors.DuplicateEmail) {
                message += errors.DuplicateEmail[0] + " "
            }
            if (errors.DuplicateUserName) {
                message += errors.DuplicateUserName[0]
            }
            return { error: message }
        } else {
            return { error: "Something went wrong. Please try again" }
        }
    }
} 

export async function Get(id: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/User/${id}`)
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

//export async function GetDataProviders(type: number): Promise<APIResponse> {
//    try {
//        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/User/${type}`)
//    } catch (error) {
//        const axiosError = error as AxiosError
//        if (axiosError.code === "ERR_NETWORK") {
//            return { error: "Network error. Please check your internet connection!" }
//        } else {
//            return { error: "Something went wrong. Please try again" }
//        }
//    }
//}