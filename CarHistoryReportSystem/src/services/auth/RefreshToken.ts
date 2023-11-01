import axios, { AxiosError } from "axios";
import { APIResponse } from "../../utils/Interfaces";

export async function RefreshToken(token: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Authentication/refresh-token`, {},
            {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Cannot connect to server. Please try again." }
        } else {
            return { error: "Something went wrong." }
        }
    }
}