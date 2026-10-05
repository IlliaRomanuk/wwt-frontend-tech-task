import { describe, expect, it } from 'vitest'

import { FilterItem, FilterType } from '../../../shared/api/types/Filter'
import { requestToSelected, selectedToRequest, toggleOption } from './selection'

const items = [
	{
		id: 'MEAL',
		name: 'Meal',
		type: FilterType.OPTION,
		options: [
			{ id: 'breakfast', name: 'Breakfast', description: '' },
			{ id: 'dinner', name: 'Dinner', description: '' }
		]
	},
	{
		id: 'BED',
		name: 'Bed',
		type: FilterType.OPTION,
		options: [{ id: 'twin', name: 'Twin', description: '' }]
	}
] as FilterItem[]

describe('selection', () => {
	it('toggles an option on and off', () => {
		const on = toggleOption({}, 'MEAL', 'dinner')
		expect(on).toEqual({ MEAL: ['dinner'] })
		expect(toggleOption(on, 'MEAL', 'dinner')).toEqual({ MEAL: [] })
	})

	it('skips groups without selected options and keeps API order', () => {
		const result = selectedToRequest(items, {
			MEAL: ['dinner', 'breakfast'],
			BED: []
		})
		expect(result).toEqual([
			{
				id: 'MEAL',
				type: FilterType.OPTION,
				optionsIds: ['breakfast', 'dinner']
			}
		])
	})

	it('round-trips saved filter into draft', () => {
		const saved = selectedToRequest(items, { BED: ['twin'] })
		expect(requestToSelected(saved)).toEqual({ BED: ['twin'] })
	})
})
