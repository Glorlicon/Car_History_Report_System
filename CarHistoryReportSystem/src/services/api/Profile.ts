import axios, { AxiosError } from "axios";
import { APIResponse, Car, CarSaleDetails, CarSalesInfo, CarSearchParams, DataProvider, EditDataProvider, Reviews, ReviewSearchParams } from "../../utils/Interfaces";

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

export async function GetCarForSaleBySellerID(Id: string, pageNumber: number, connectAPIError: string, language: string, carSearchParams: CarSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/car-dealer/${Id}`,
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

export async function GetAllCarForSaleBySellerID(Id: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Cars/car-dealer/${Id}`,
            {
                headers: {
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageSize: 9999999
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

export async function GetReviewByDataProvider(pageNumber: number, connectAPIError: string, language: string, reviewSearchParams: ReviewSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/reviews`,
            {
                headers: {
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    DataProviderId: reviewSearchParams.dataproviderId,
                    ...(reviewSearchParams.rating !== 0 && { Rating: reviewSearchParams.rating }),
                    SortByRating: reviewSearchParams.sortByRating,
                    SortByDate: reviewSearchParams.sortByDate
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

export async function GetReviewAllByDataProvider(connectAPIError: string, language: string, Id: number): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/reviews`,
            {
                headers: {
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    DataProviderId: Id,
                    PageSize: 99999999
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

export async function editUserReview(id: number, data: Reviews, token: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/${id}/review`,
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
