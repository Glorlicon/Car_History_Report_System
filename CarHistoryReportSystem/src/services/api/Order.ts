import axios, { AxiosError } from "axios"
import { formatDateToString, getSpecialDatesFormatted } from "../../utils/Dates"
import { APIResponse, OrderSearchParams } from "../../utils/Interfaces"

export async function ListOrders(token: string, pageNumber: number, connectAPIError: string, language: string, searchParams: OrderSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Orders`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': `${language}`,
                'Cache-Control': 'no-cache'
            },
            params: {
                PageNumber: pageNumber,
                UserId: searchParams.usedId,
                OrderOptionId: searchParams.orderOption,
                TransactionId: searchParams.transactionId,
                CreatedDateStart: searchParams.createdDateStart,
                CreatedDateEnd: searchParams.createdDateEnd
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
export async function ListOrdersForGraph(token: string, connectAPIError: string, language: string): Promise<APIResponse> {
    try {
        const rangeDates = getSpecialDatesFormatted()
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Orders`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': `${language}`,
                'Cache-Control': 'no-cache'
            },
            params: {
                PageNumber: 1,
                CreatedDateStart: rangeDates.firstDayOfSixMonthsAgo,
                CreatedDateEnd: rangeDates.lastDayOfCurrentMonth,
                PageSize: 100000
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
export async function ListOrdersExcel(token: string, pageNumber: number, connectAPIError: string, language: string, searchParams: OrderSearchParams): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/Orders`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': `${language}`,
                'Cache-Control': 'no-cache',
                'Accept': 'text/csv'
            },
            params: {
                PageNumber: pageNumber,
                UserId: searchParams.usedId,
                OrderOptionId: searchParams.orderOption,
                TransactionId: searchParams.transactionId,
                CreatedDateStart: searchParams.createdDateStart,
                CreatedDateEnd: searchParams.createdDateEnd
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