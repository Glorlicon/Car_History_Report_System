import axios, { AxiosError } from "axios";
import { APIResponse, Car, CarSaleDetails, CarSaleSearchParams, CarSalesInfo, CarStorageSearchParams, PartialPlateSearchParams } from "../../utils/Interfaces";

export async function ListCarDealerCarForSale(dealerId: number, token: string, pageNumber: number, connectAPIError: string, language: string, searchParams: CarSaleSearchParams): Promise<APIResponse> {
    try {
        let params: any = {
            PageNumber: pageNumber,
            VinId: searchParams.vin,
            Make: searchParams.manufacturer,
            Model: searchParams.model
        };

        if (searchParams.releaseDateMin !== '') {
            params.YearStart = searchParams.releaseDateMin;
        }
        if (searchParams.releaseDateMax !== '') {
            params.YearEnd = searchParams.releaseDateMax;
        }
        if (searchParams.odometerMin !== '') {
            params.MileageMin = searchParams.odometerMin;
        }
        if (searchParams.odometerMax !== '') {
            params.MileageMax = searchParams.odometerMax;
        }
        if (searchParams.odometerMin !== '') {
            params.MileageMin = searchParams.odometerMin;
        }
        if (searchParams.odometerMax !== '') {
            params.MileageMax = searchParams.odometerMax;
        }
        if (searchParams.priceMin !== '') {
            params.PriceMin = searchParams.priceMin
        }
        if (searchParams.priceMax !== '') {
            params.PriceMax = searchParams.priceMax
        }
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/car-dealer/${dealerId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: params
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

export async function AddCar(data: Car, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Cars`,
            {
                ...data,
                color: Number(data.color)
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

export async function EditCar(data: Car, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/${data.vinId}`,
            {
                ...data,
                color: Number(data.color)
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

export async function CreateCarForSale(data: CarSalesInfo, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    console.log("New")
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/${data.carId}/car-sales-info`,data,
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
        }  else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function SaleCar(data: CarSaleDetails, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/${data.carId}/sold`, data,
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
        }  else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}

export async function EditCarForSale(data: CarSalesInfo, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/${data.carId}/car-sales-info`, data,
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
export async function GetCar(id: string, token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        console.log("res: ", response.data)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" }
        } else if (axiosError.response?.status === 404) {
            return { error: (axiosError.response.data as any).error }
        } else {
            return { error: "Something went wrong. Please try again" }
        }
    }
}

export async function ListDealerCarStorage(token: string, pageNumber: number, connectAPIError: string, language: string, searchParams: CarStorageSearchParams): Promise<APIResponse> {
    try {
        let params: any = {
            PageNumber: pageNumber,
            VinId: searchParams.vin,
            Make: searchParams.manufacturer,
            Model: searchParams.model
        };

        if (searchParams.releaseDateMin !== '') {
            params.YearStart = searchParams.releaseDateMin;
        }
        if (searchParams.releaseDateMax !== '') {
            params.YearEnd = searchParams.releaseDateMax;
        }
        if (searchParams.odometerMin !== '') {
            params.MileageMin = searchParams.odometerMin;
        }
        if (searchParams.odometerMax !== '') {
            params.MileageMax = searchParams.odometerMax;
        }
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/storage`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: params
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

export async function AddOldCarToStorage(dataProviderId: number, vin: string, token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/storage/${vin}`,
            {
                dataProviderId: dataProviderId
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

export async function PlateSearch(pageNumber: number, token: string, connectAPIError: string, language: string, partialPlateSearchParams: PartialPlateSearchParams): Promise<APIResponse> {
    try {
        let plate = partialPlateSearchParams.partialPlate.replace(/\*/g, '%2A')
        console.log("Plate",plate)
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/partial-plate-search?searchString=${plate}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                }
            })
            console.log(response)
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        console.log(error)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).error[0] }
        }
    }
}