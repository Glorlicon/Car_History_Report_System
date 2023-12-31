import axios, { AxiosError } from "axios";
import { APIResponse, UsersRequest, AdminRequest, RequestSearchParams } from "../../utils/Interfaces";

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

export async function GetUserRequests(id: string, token: string, pageNumber: number, connectAPIError: string, language: string, requestSearchParams: RequestSearchParams): Promise<APIResponse> {
    try {

        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Request/user/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    RequestType: requestSearchParams.requestType < 0 ? undefined : requestSearchParams.requestType,
                    RequestStatus: requestSearchParams.requestStatus < 0 ? undefined : requestSearchParams.requestStatus,
                    SortByDate: requestSearchParams.sortByDate
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


export async function GetAllUserRequest(token: string, pageNumber: number, connectAPIError: string, language: string, requestSearchParams: RequestSearchParams): Promise<APIResponse> {
    try {

        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Request`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    RequestType: requestSearchParams.requestType < 0 ? undefined : requestSearchParams.requestType,
                    RequestStatus: requestSearchParams.requestStatus < 0 ? undefined : requestSearchParams.requestStatus,
                    SortByDate: requestSearchParams.sortByDate
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

export async function AddRequest(data: UsersRequest, token: string): Promise<APIResponse> {
    console.log(data)
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Request`,
            {
                ...data,
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

export async function ResponseRequest(data: AdminRequest, token: string, connectAPIError: string, unknownError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/Request/${data.id}`,
            {
                response: data.response,
                status: Number(data.status)
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
        console.log(axiosError)
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}

export async function GetAllRequestTypesList(token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Request/request-types-list`,
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

export async function GetAllRequestStatusesList(token: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Request/request-statuses-list`,
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