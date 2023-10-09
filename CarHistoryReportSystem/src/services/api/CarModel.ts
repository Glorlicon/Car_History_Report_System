import axios, { AxiosError } from "axios"
import { APIResponse, CarModel } from "../../utils/Interfaces"

export async function ListAdminCarModels(): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarSpecification`)
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

export async function AddCarModel(data: CarModel, token: string): Promise<APIResponse> {
    console.log("Data: ",data)
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarSpecification`,
            {
                ...data,
                fuelType: Number(data.fuelType),
                bodyType: Number(data.bodyType)
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
export async function EditCarModel(data: CarModel, token: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarSpecification/${data.modelID}`, 
            {
                ...data,
                fuelType: Number(data.fuelType),
                bodyType: Number(data.bodyType)
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
