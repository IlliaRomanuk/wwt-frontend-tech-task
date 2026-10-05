import filterData from '../temp/filterData.json'
import { FilterItem } from './types/Filter'

interface FilterDataResponse {
	filterItems: FilterItem[]
}

// Имитация запроса к API: данные берём из filterData.json
export const fetchFilterItems = async (): Promise<FilterItem[]> => {
	await new Promise(resolve => setTimeout(resolve, 300))

	return (filterData as unknown as FilterDataResponse).filterItems
}
