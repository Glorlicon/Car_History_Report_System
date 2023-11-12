import axios, { AxiosError } from "axios";
import { APIResponse, CarMaintenance } from "../../utils/Interfaces";

export async function ListCarMaintenance(userId: string, token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarMaintainance/user/${userId}`,
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

export async function AddCarMaintenance(data: CarMaintenance, token: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarMaintainance/car-maintainance`, data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log("data", axiosError)
        //500 not exist 400 duplicate
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else if (axiosError.response?.status === 500) {
            return { error: "This car doesn't exist in the system" }
        } else if (axiosError.response?.status === 400) {
            return { error: "This car is already in your garage" }
        } else {
            return { error: "Something went wrong. Please try again" }
        }
    }
}

export async function RemoveCarMaintenance(data: CarMaintenance, token: string): Promise<APIResponse> {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/api/CarMaintainance/car-maintainance/car/${data.carId}/user/${data.userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        return { data: response.data }
    } catch (error) {
        //404 not exist
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else if (axiosError.response?.status === 404) {
            return { error: "This car doesn't exist in the system" }
        } else {
            return { error: "Something went wrong. Please try again" }
        }
    }
}

export async function GetMaintenanceDetails(carId: string, token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarMaintainance/${carId}`,
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

export async function GetCarServiceHistory(vin: string, token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarServiceHistory/car/${vin}`,
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