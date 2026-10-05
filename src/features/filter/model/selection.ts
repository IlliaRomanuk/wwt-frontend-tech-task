import { FilterItem, FilterType } from '../../../shared/api/types/Filter'
import { SearchRequestFilter } from '../../../shared/api/types/SearchRequest/SearchRequestFilter'

// groupId -> выбранные optionId (черновик внутри модалки)
export type SelectedOptions = Record<string, string[]>

export const requestToSelected = (
	filter: SearchRequestFilter
): SelectedOptions =>
	Object.fromEntries(
		filter.map((item): [string, string[]] => [item.id, item.optionsIds])
	)

export const selectedToRequest = (
	items: FilterItem[],
	selected: SelectedOptions
): SearchRequestFilter =>
	items.flatMap(item => {
		if (item.type !== FilterType.OPTION) {
			return []
		}

		const optionsIds = item.options
			.map(option => option.id)
			.filter(id => selected[item.id]?.includes(id))

		return optionsIds.length > 0
			? [{ id: item.id, type: item.type, optionsIds }]
			: []
	})

export const toggleOption = (
	selected: SelectedOptions,
	groupId: string,
	optionId: string
): SelectedOptions => {
	const current = selected[groupId] ?? []
	const next = current.includes(optionId)
		? current.filter(id => id !== optionId)
		: [...current, optionId]

	return { ...selected, [groupId]: next }
}
