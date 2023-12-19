import axios, { AxiosError } from "axios"
import { APIResponse, Car, CarModel, CarSearchParams, ContactMail } from "../../utils/Interfaces"


export async function ListCarForSale(pageNumber: number, connectAPIError: string, language: string, carSearchParams: CarSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/selling`,
            {
                headers: {
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    Make: carSearchParams.make,
                    Model: carSearchParams.model,
                    YearStart: carSearchParams.yearstart,
                    PriceMax: carSearchParams.pricemax,
                    MilageMax: carSearchParams.milagemax
                }
            })
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination']) }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
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

export async function GetCarForSaleBySellerID(Id: String): Promise<APIResponse> {
    try {
        Id = Id.substring(3);
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


export async function GetDealerProfile(Id: String, token: string) {
    console.log("New")
    try {
        Id = Id.substring(3);
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/User/${Id}`,
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
            return { error: (axiosError.response.data as any).error[0] }
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

export async function ListManufacturer(): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/type/3`)
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

export async function ListManufacturerModel(connectAPIError: string, language: string, manufacturerId: number): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarSpecification/manufacturer/${manufacturerId}`,
            {
                headers: {
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageSize: 999
                }
            })
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination']) }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}