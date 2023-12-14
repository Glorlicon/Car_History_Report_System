import axios, { AxiosError } from "axios"
import { APIResponse, CarModel, CarModelSearchParams } from "../../utils/Interfaces"

export async function ListAdminCarModels(token: string, pageNumber: number, connectAPIError: string, unknownError: string, language: string, searchParams: CarModelSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarSpecification/created-by-admin`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    ModelID: searchParams.modelId,
                    ManufacturerName: searchParams.manuName,
                    ReleasedDateStart: searchParams.releasedDateStart,
                    ReleasedDateEnd: searchParams.releasedDateEnd
                }
            })
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination']) }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}

export async function ListManufaturerCarModels(id: number, token: string, pageNumber: number, connectAPIError: string, unknownError: string, language: string, searchParams: CarModelSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarSpecification/manufacturer/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    ModelID: searchParams.modelId,
                    ManufacturerName: searchParams.manuName,
                    ReleasedDateStart: searchParams.releasedDateStart,
                    ReleasedDateEnd: searchParams.releasedDateEnd
                }
            })
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination']) }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}

export async function AddCarModel(data: CarModel, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/CarSpecification`,
            {
                ...data,
                fuelType: Number(data.fuelType),
                bodyType: Number(data.bodyType)
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`
                }
            }
        )
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log("Add Error!: ", error)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}
export async function EditCarModel(data: CarModel, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/CarSpecification/${data.modelID}`, 
            {
                ...data,
                fuelType: Number(data.fuelType),
                bodyType: Number(data.bodyType)
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`
                }
            }
        )
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log("Edit Error!: ", error)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}


export async function ListAllCarModels(token: string, pageNumber: number, connectAPIError: string, unknownError: string, language: string, searchParams: CarModelSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarSpecification`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    ModelID: searchParams.modelId,
                    ManufacturerName: searchParams.manuName,
                    ReleasedDateStart: searchParams.releasedDateStart,
                    ReleasedDateEnd: searchParams.releasedDateEnd,
                    PageSize: 100000
                }
            })
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination']) }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}
