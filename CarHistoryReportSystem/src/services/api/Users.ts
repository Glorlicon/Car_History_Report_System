import axios, { AxiosError } from "axios";
import { USER_ROLE } from "../../utils/const/UserRole";
import { AdminUserSearchParams, APIResponse, DataProvider, User } from "../../utils/Interfaces";

interface CreateErrors {
    DuplicateEmail: string[]
    DuplicateUserName: string[]
}
export async function List(token: string, pageNumber: number, connectAPIError: string, unknownError: string,language: string, userSearchParams: AdminUserSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/User`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': `${language}`,
                'Cache-Control': 'no-cache'
            },
            params: {
                PageNumber: pageNumber,
                Username: userSearchParams.username,
                Email: userSearchParams.email,
                Role: userSearchParams.role,
                DataProviderName: userSearchParams.dataProviderName
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

export async function Add(data: User, token: string, connectAPIError: string, unknownError: string, language: string): Promise<APIResponse> {
    const checkRole = data.role == USER_ROLE.ADMIN || data.role == USER_ROLE.USER
    const checkNewDataProvider = data.dataProvider === undefined //true -> uses old data provider, false -> uses new data provider
    const _dataProvider = checkNewDataProvider ? undefined : {
        ...data.dataProvider,
        type: +data.role - 2
    } as DataProvider
    const verifiedData: User = {
        ...data,
        role: +data.role,
        dataProvider: checkRole ? undefined : _dataProvider,
        dataProviderId: checkRole && checkNewDataProvider ? null : data.dataProviderId
}
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/User`, verifiedData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': `${language}`
            }
        })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else if (axiosError.code === "ERR_BAD_REQUEST") {
            const errors = axiosError.response?.data as CreateErrors
            let message = ""
            if (errors.DuplicateEmail) {
                message += errors.DuplicateEmail[0] + " "
            }
            if (errors.DuplicateUserName) {
                message += errors.DuplicateUserName[0]
            }
            return { error: message }
        } else {
            return { error: unknownError }
        }
    }
} 

export async function Edit(id: string, data: User, token: string, connectAPIError: string, unknownError: string, language: string): Promise<APIResponse> {
    const checkRole = data.role == USER_ROLE.ADMIN || data.role == USER_ROLE.USER
    const verifiedData: User = {
        ...data,
        dataProviderId: checkRole ? null : data.dataProviderId
    }
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/User/${id}`, verifiedData,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': `${language}`
            }
        })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else if (axiosError.code === "ERR_BAD_REQUEST") {
            const errors = axiosError.response?.data as CreateErrors
            let message = ""
            if (errors.DuplicateEmail) {
                message += errors.DuplicateEmail[0] + " "
            }
            if (errors.DuplicateUserName) {
                message += errors.DuplicateUserName[0]
            }
            return { error: message }
        } else {
            return { error: unknownError }
        }
    }
} 

export async function Get(id: string, token: string, connectAPIError: string, unknownError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/User/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': `${language}`
            }
        })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}

export async function GetDataProviders(type: number, token: string, connectAPIError: string, unknownError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/type/${type}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': `${language}`
            }
        })
        return { data: response.data }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}

export async function SuspendUser(id: string, token: string, connectAPIError: string, unknownError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Authentication/suspend-account?userId=${id}`, {} ,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': `${language}`
            }
        })
        return { data: "Success"}
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}

export async function UnsuspendUser(id: string, token: string, connectAPIError: string, unknownError: string, language: string): Promise<APIResponse> {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/Authentication/unsuspend-account?userId=${id}`, {} ,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': `${language}`
            }
        })
        return { data: "Success" }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: unknownError }
        }
    }
}