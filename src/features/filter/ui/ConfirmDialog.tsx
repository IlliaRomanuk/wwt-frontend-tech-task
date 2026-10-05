import { useId } from 'react'
import { useTranslation } from 'react-i18next'

import { CloseButton } from '../../../shared/ui/CloseButton'
import { Modal } from '../../../shared/ui/Modal'

interface ConfirmDialogProps {
	onDismiss: () => void
	onUseOld: () => void
	onApplyNew: () => void
}

export const ConfirmDialog = ({
	onDismiss,
	onUseOld,
	onApplyNew
}: ConfirmDialogProps) => {
	const { t } = useTranslation('filter')
	const titleId = useId()

	return (
		<Modal
			titleId={titleId}
			onClose={onDismiss}
			className="max-w-[780px]"
		>
			<header className="relative px-5 pt-4 text-center">
				<h2
					id={titleId}
					className="text-2xl"
				>
					{t('confirm.title')}
				</h2>
				<CloseButton
					label={t('close')}
					onClick={onDismiss}
					className="absolute top-5 right-4"
				/>
			</header>

			<div className="flex justify-center gap-5 px-5 pt-[72px] pb-[18px]">
				<button
					type="button"
					onClick={onUseOld}
					className="h-[38px] max-w-[168px] flex-1 rounded-lg border border-[#31393c] bg-white text-xs hover:bg-gray-50"
				>
					{t('confirm.useOld')}
				</button>
				<button
					type="button"
					onClick={onApplyNew}
					className="h-[38px] max-w-[168px] flex-1 rounded-lg bg-[#ff5f00] text-xs text-white hover:bg-[#e65600]"
				>
					{t('confirm.applyNew')}
				</button>
			</div>
		</Modal>
	)
}
