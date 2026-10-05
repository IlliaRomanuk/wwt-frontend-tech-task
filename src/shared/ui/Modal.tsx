import { ReactNode, useEffect, useRef, useState } from 'react'

interface ModalProps {
	titleId: string
	onClose: () => void
	children: ReactNode
	className?: string
}

// Счётчик нужен, чтобы вложенные модалки (фильтр + подтверждение)
// не снимали блокировку скролла раньше времени
let openModalsCount = 0

const lockPageScroll = () => {
	openModalsCount += 1
	document.body.style.overflow = 'hidden'
}

const unlockPageScroll = () => {
	openModalsCount -= 1

	if (openModalsCount === 0) {
		document.body.style.overflow = ''
	}
}

// Обёртка над нативным <dialog>: фокус-трап, Esc и inert-фон работают из коробки
export const Modal = ({
	titleId,
	onClose,
	children,
	className = ''
}: ModalProps) => {
	const ref = useRef<HTMLDialogElement>(null)
	const pressStartedOnBackdrop = useRef(false)
	// запоминаем элемент, с которого открыли модалку, чтобы вернуть на него фокус
	const [previouslyFocused] = useState(
		() => document.activeElement as HTMLElement | null
	)

	useEffect(() => {
		const dialog = ref.current

		if (dialog && !dialog.open) {
			dialog.showModal()
		}

		lockPageScroll()

		return () => {
			unlockPageScroll()
			previouslyFocused?.focus()
		}
	}, [previouslyFocused])

	return (
		<dialog
			ref={ref}
			aria-labelledby={titleId}
			onClose={onClose}
			onMouseDown={event => {
				pressStartedOnBackdrop.current = event.target === event.currentTarget
			}}
			onClick={event => {
				// закрываем только если и нажатие, и отпускание были на backdrop
				// (иначе выделение текста с выходом за границы закрывало бы окно)
				if (
					pressStartedOnBackdrop.current &&
					event.target === event.currentTarget
				) {
					onClose()
				}
			}}
			className={`m-auto w-[calc(100%-2rem)] rounded-2xl bg-white p-0 text-[#31393c] backdrop:bg-black/[.27] backdrop:backdrop-blur-xs open:flex open:flex-col ${className}`}
		>
			{children}
		</dialog>
	)
}
