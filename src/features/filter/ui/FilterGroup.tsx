import { FilterItem } from '../../../shared/api/types/Filter'

interface FilterGroupProps {
	item: FilterItem
	selectedIds: string[]
	onToggle: (groupId: string, optionId: string) => void
}

export const FilterGroup = ({
	item,
	selectedIds,
	onToggle
}: FilterGroupProps) => (
	<fieldset className="min-w-0 border-b border-[#d0d0d0] last:border-b-0">
		<legend className="pt-4 pb-3 text-lg font-medium">{item.name}</legend>

		<div className="grid grid-cols-1 gap-x-6 gap-y-2 pb-5 min-[480px]:grid-cols-2 sm:grid-cols-3">
			{item.options.map(option => (
				<label
					key={option.id}
					title={option.description}
					className="flex cursor-pointer items-center gap-3 text-xs leading-4"
				>
					<input
						type="checkbox"
						checked={selectedIds.includes(option.id)}
						onChange={() => onToggle(item.id, option.id)}
						className="size-[13px] shrink-0 accent-[#ff5f00]"
					/>
					{option.name}
				</label>
			))}
		</div>
	</fieldset>
)
