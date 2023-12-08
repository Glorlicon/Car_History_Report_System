import axios, { AxiosError } from "axios";
import { APIResponse, Car, CarSaleDetails, CarSalesInfo, DataProvider, EditDataProvider, Reviews } from "../../utils/Interfaces";

export async function GetDealerProfileData(Id: String) {
    console.log("New")
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/${Id}`
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

export async function GetUserById(Id: String) {
    console.log("New")

    // Extracting the actual ID from the string
    const actualId = Id.replace('id=', '');

    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/User/${actualId}`);
        return { data: response.data };
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log("Add Error!: ", error);
        if (axiosError.code === "ERR_NETWORK") {
            return { error: "Network error. Please check your internet connection!" };
        } else if (axiosError.response?.status === 404) {
            return { error: (axiosError.response.data as any).error };
        } else {
            return { error: "Something went wrong. Please try again" };
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

export async function AddReview(id: number, data: Reviews, token: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/${id}/review`,
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

export async function GetReviewByDataProvider(Id: number) {
    console.log("New")
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/reviews?DataproviderId=${Id}`,
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

export async function GetCarServiceByDataprovider(Id: number) {
    console.log("New")
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/CarServiceHistory/data-provider/${Id}`,
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

export async function GetDataProviderByID(Id: number) {
    console.log(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/${Id}`)
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/${Id}`,
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

export async function GetUserComment(DataProviderId: number, UserId: string, token: string) {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/${DataProviderId}/review/${UserId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
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