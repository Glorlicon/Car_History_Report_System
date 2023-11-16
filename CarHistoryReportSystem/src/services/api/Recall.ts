import axios, { AxiosError } from "axios";
import { APIResponse, CarModel, CarRecalls } from "../../utils/Interfaces";

export async function ListManufacturerRecalls(id: number, token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarRecall/manufacturer/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
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

export async function AddCarRecall(data: CarRecalls, token: string): Promise<APIResponse> {
    console.log("Data: ", data)
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarRecall`,
            {
                ...data
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
        console.log("Add Error!: ", error)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            return { error: "Something went wrong. Please try again" }
        }
    }
}

export async function EditCarRecall(data: CarRecalls, token: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarRecall/${data.id}`,
            {
                ...data,
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
        console.log("Edit Error!: ", error)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            return { error: "Something went wrong. Please try again" }
        }
    }
}