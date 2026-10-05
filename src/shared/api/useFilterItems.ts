import { useQuery } from '@tanstack/react-query'

import { fetchFilterItems } from './filters'

export const useFilterItems = () =>
	useQuery({
		queryKey: ['filter-items'],
		queryFn: fetchFilterItems,
		staleTime: Infinity
	})
