import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFilterStore } from '../../../features/filter/model/store'
import { FilterModal } from '../../../features/filter/ui/FilterModal'
import { useFilterItems } from '../../../shared/api/useFilterItems'

export const App = () => {
	const { t } = useTranslation('filter')
	const { data: items, isPending, isError } = useFilterItems()
	const filter = useFilterStore(state => state.filter)
	const setFilter = useFilterStore(state => state.setFilter)
	const [isOpen, setIsOpen] = useState(false)

	return (
		<main className="mx-auto max-w-3xl p-6">
			<h1 className="mb-4 text-2xl font-medium">{t('home.title')}</h1>

			<button
				type="button"
				disabled={isPending || isError}
				onClick={() => setIsOpen(true)}
				className="rounded-lg bg-orange-500 px-6 py-2.5 text-white disabled:opacity-50"
			>
				{t('home.open')}
			</button>

			{isError && <p role="alert">{t('home.error')}</p>}

			<section
				aria-label={t('home.current')}
				className="mt-6"
			>
				<pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 text-xs">
					{JSON.stringify(filter, null, 2)}
				</pre>
			</section>

			{isOpen && items && (
				<FilterModal
					items={items}
					saved={filter}
					onApply={next => {
						setFilter(next)
						setIsOpen(false)
					}}
					onClose={() => setIsOpen(false)}
				/>
			)}
		</main>
	)
}
