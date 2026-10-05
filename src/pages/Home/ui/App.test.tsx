import { initReactI18next } from 'react-i18next'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
	within
} from '@testing-library/react'
import i18next from 'i18next'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { useFilterStore } from '../../../features/filter/model/store'
import { FilterType } from '../../../shared/api/types/Filter'
import filterLocale from '../../../shared/i18n/locales/en/filter.json'
import { App } from './App'

const WAIT = { timeout: 3000 }
const CONFIRM_TITLE = 'Do you want to apply new filter'

const renderApp = () =>
	render(
		<QueryClientProvider client={new QueryClient()}>
			<App />
		</QueryClientProvider>
	)

const currentFilter = () =>
	JSON.parse(
		screen.getByRole('region', { name: 'Current filter' }).textContent ?? ''
	)

const openModal = async () => {
	const button = await screen.findByRole('button', { name: 'Filters' }, WAIT)

	await waitFor(() => expect(button).toBeEnabled(), WAIT)
	fireEvent.click(button)

	return screen.getByRole('dialog', { name: 'Filter' })
}

beforeAll(async () => {
	// jsdom не реализует <dialog>.showModal()/close()
	HTMLDialogElement.prototype.showModal = function showModal() {
		this.setAttribute('open', '')
		// как в браузере: фокус переходит внутрь модалки
		this.querySelector<HTMLElement>('button, input')?.focus()
	}
	HTMLDialogElement.prototype.close = function close() {
		this.removeAttribute('open')
		this.dispatchEvent(new Event('close'))
	}

	await i18next.use(initReactI18next).init({
		lng: 'en',
		ns: ['filter'],
		resources: { en: { filter: filterLocale } },
		interpolation: { escapeValue: false }
	})
})

beforeEach(() => useFilterStore.setState({ filter: [] }))
afterEach(cleanup)

describe('filter modal flow', () => {
	it('renders groups from API data with all options unchecked', async () => {
		renderApp()
		const modal = await openModal()

		expect(
			within(modal).getByRole('group', { name: 'Meal options' })
		).toBeInTheDocument()
		within(modal)
			.getAllByRole('checkbox')
			.forEach(checkbox => expect(checkbox).not.toBeChecked())
	})

	it('saves selection only after confirmation', async () => {
		renderApp()
		const modal = await openModal()

		fireEvent.click(
			within(modal).getByRole('checkbox', { name: 'Breakfast included' })
		)
		fireEvent.click(within(modal).getByRole('button', { name: 'Apply' }))

		expect(screen.getByRole('dialog', { name: CONFIRM_TITLE })).toBeVisible()
		expect(currentFilter()).toEqual([])

		fireEvent.click(screen.getByRole('button', { name: 'Apply new filter' }))

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		expect(currentFilter()).toEqual([
			{ id: 'MEAL_OPTIONS', type: 'OPTION', optionsIds: ['breakfast'] }
		])

		const reopened = await openModal()

		expect(
			within(reopened).getByRole('checkbox', { name: 'Breakfast included' })
		).toBeChecked()
	})

	it('keeps old filter on "Use old filter" and pre-fills modal on reopen', async () => {
		useFilterStore.setState({
			filter: [
				{ id: 'BED_TYPE', type: FilterType.OPTION, optionsIds: ['twin-beds'] }
			]
		})
		renderApp()
		const modal = await openModal()

		expect(
			within(modal).getByRole('checkbox', { name: 'Twin beds' })
		).toBeChecked()

		fireEvent.click(within(modal).getByRole('checkbox', { name: 'Gym' }))
		fireEvent.click(within(modal).getByRole('button', { name: 'Apply' }))
		fireEvent.click(screen.getByRole('button', { name: 'Use old filter' }))

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		expect(currentFilter()).toEqual([
			{ id: 'BED_TYPE', type: 'OPTION', optionsIds: ['twin-beds'] }
		])

		const reopened = await openModal()

		expect(
			within(reopened).getByRole('checkbox', { name: 'Twin beds' })
		).toBeChecked()
		expect(
			within(reopened).getByRole('checkbox', { name: 'Gym' })
		).not.toBeChecked()
	})

	it('discards changes when closed with the X button', async () => {
		renderApp()
		const modal = await openModal()

		fireEvent.click(within(modal).getByRole('checkbox', { name: 'Pool' }))
		fireEvent.click(within(modal).getByRole('button', { name: 'Close' }))

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		expect(currentFilter()).toEqual([])
	})

	it('"Clear all parameters" empties the draft', async () => {
		renderApp()
		const modal = await openModal()
		const checkbox = within(modal).getByRole('checkbox', { name: 'Spa' })

		fireEvent.click(checkbox)
		expect(checkbox).toBeChecked()
		fireEvent.click(
			within(modal).getByRole('button', { name: 'Clear all parameters' })
		)
		expect(checkbox).not.toBeChecked()
	})

	it('Esc on the confirm dialog closes only the confirm dialog', async () => {
		renderApp()
		const modal = await openModal()

		fireEvent.click(within(modal).getByRole('button', { name: 'Apply' }))
		fireEvent(
			screen.getByRole('dialog', { name: CONFIRM_TITLE }),
			new Event('close')
		)

		expect(
			screen.queryByRole('dialog', { name: CONFIRM_TITLE })
		).not.toBeInTheDocument()
		expect(screen.getByRole('dialog', { name: 'Filter' })).toBeInTheDocument()
	})

	it('closes on backdrop click, but not when a press started inside', async () => {
		renderApp()
		const modal = await openModal()

		fireEvent.mouseDown(within(modal).getByRole('checkbox', { name: 'Gym' }))
		fireEvent.click(modal)
		expect(screen.getByRole('dialog', { name: 'Filter' })).toBeInTheDocument()

		fireEvent.mouseDown(modal)
		fireEvent.click(modal)
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})

	it('locks page scroll while open and restores it afterwards', async () => {
		renderApp()
		const modal = await openModal()

		expect(document.body.style.overflow).toBe('hidden')

		fireEvent.click(within(modal).getByRole('button', { name: 'Close' }))
		expect(document.body.style.overflow).toBe('')
	})

	it('returns focus to the trigger button after closing', async () => {
		renderApp()
		const trigger = await screen.findByRole('button', { name: 'Filters' }, WAIT)

		await waitFor(() => expect(trigger).toBeEnabled(), WAIT)
		trigger.focus()
		fireEvent.click(trigger)
		fireEvent.click(
			within(screen.getByRole('dialog')).getByRole('button', { name: 'Close' })
		)

		expect(trigger).toHaveFocus()
	})
})
