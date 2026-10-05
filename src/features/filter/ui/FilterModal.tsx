import { FormEvent, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterItem } from '../../../shared/api/types/Filter'
import { SearchRequestFilter } from '../../../shared/api/types/SearchRequest/SearchRequestFilter'
import { CloseButton } from '../../../shared/ui/CloseButton'
import { Modal } from '../../../shared/ui/Modal'
import {
	requestToSelected,
	selectedToRequest,
	toggleOption
} from '../model/selection'
import { ConfirmDialog } from './ConfirmDialog'
import { FilterGroup } from './FilterGroup'

interface FilterModalProps {
	items: FilterItem[]
	saved: SearchRequestFilter
	onApply: (filter: SearchRequestFilter) => void
	onClose: () => void
}

// Монтируется только когда открыта => черновик каждый раз стартует с сохранённых данных
export const FilterModal = ({
	items,
	saved,
	onApply,
	onClose
}: FilterModalProps) => {
	const { t } = useTranslation('filter')
	const titleId = useId()
	const [selected, setSelected] = useState(() => requestToSelected(saved))
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault()
		setIsConfirmOpen(true)
	}

	return (
		<>
			<Modal
				titleId={titleId}
				onClose={onClose}
				className="max-h-[90dvh] max-w-[780px]"
			>
				<form
					onSubmit={handleSubmit}
					className="flex min-h-0 flex-1 flex-col"
				>
					<header className="relative border-b border-[#d0d0d0] px-5 py-[18px] text-center">
						<h2
							id={titleId}
							className="text-2xl"
						>
							{t('title')}
						</h2>
						<CloseButton
							label={t('close')}
							onClick={onClose}
							className="absolute top-1/2 right-4 -translate-y-1/2"
						/>
					</header>

					<div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-7">
						{items.map(item => (
							<FilterGroup
								key={item.id}
								item={item}
								selectedIds={selected[item.id] ?? []}
								onToggle={(groupId, optionId) =>
									setSelected(prev => toggleOption(prev, groupId, optionId))
								}
							/>
						))}
					</div>

					<footer className="flex flex-col items-center gap-3 border-t border-[#d0d0d0] px-5 pt-5 pb-6 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-0">
						<span className="hidden sm:block" />
						<button
							type="submit"
							className="h-9 w-28 rounded-lg bg-[#ff5f00] text-xs text-white hover:bg-[#e65600]"
						>
							{t('apply')}
						</button>
						<button
							type="button"
							onClick={() => setSelected({})}
							className="text-xs text-[#359da5] underline sm:justify-self-end"
						>
							{t('clearAll')}
						</button>
					</footer>
				</form>
			</Modal>

			{isConfirmOpen && (
				<ConfirmDialog
					onDismiss={() => setIsConfirmOpen(false)}
					onUseOld={onClose}
					onApplyNew={() => onApply(selectedToRequest(items, selected))}
				/>
			)}
		</>
	)
}
