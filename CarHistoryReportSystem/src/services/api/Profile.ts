import axios, { AxiosError } from "axios";
import { APIResponse, Car, CarSaleDetails, CarSalesInfo, DataProvider, EditDataProvider } from "../../utils/Interfaces";

export async function GetDealerProfileData(Id: String, token: string) {
    console.log("New")
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/${Id}`,
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
        } else if (axiosError.response?.status === 404) {
            return { error: (axiosError.response.data as any).error }
        } else {
            return { error: "Something went wrong. Please try again" }
        }
    }
}

export async function GetCarForSaleBySellerID(Id: String): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/car-dealer/${Id}`)
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

export async function EditProfile(data: EditDataProvider, token: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/${data.id}`,
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
        console.log("Edit Error!: ", error)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else {
            return { error: "Something went wrong. Please try again" }
        }
    }
}