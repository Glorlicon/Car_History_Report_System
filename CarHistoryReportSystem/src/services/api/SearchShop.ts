import axios, { AxiosError } from "axios";
import { APIResponse, DataProvider, DataProviderSearchForm } from "../../utils/Interfaces";

export async function GetDataProviderByType(pageNumber: number, connectAPIError: string, language: string, DealerSearchParams: DataProviderSearchForm): Promise<APIResponse> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/DataProvider/type/${DealerSearchParams.type}`,
            {
                headers: {
                    'Accept-Language': `${language}`,
                    'Cache-Control': 'no-cache'
                },
                params: {
                    PageNumber: pageNumber,
                    Name: DealerSearchParams.name,
                    SortByName: DealerSearchParams.sortByName
                }
            })
        return { data: response.data, pages: JSON.parse(response.headers['x-pagination']) }
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.code === "ERR_NETWORK") {
            return { error: connectAPIError }
        } else {
            return { error: (axiosError.response?.data as any).Error[0] }
        }
    }
}