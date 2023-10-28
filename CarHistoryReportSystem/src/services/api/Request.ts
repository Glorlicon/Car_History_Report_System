import axios, { AxiosError } from "axios";
import { APIResponse, UsersRequest } from "../../utils/Interfaces";

export async function GetUserRequest(id: string, token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Request/user/${id}`,
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

export async function AddRequest(data: UsersRequest, token: string): Promise<APIResponse> {
    console.log(data)
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Request`,
            {
                ...data,
                status: 0,
                type: Number(data.type)
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