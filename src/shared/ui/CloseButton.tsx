interface CloseButtonProps {
	label: string
	onClick: () => void
	className?: string
}

export const CloseButton = ({
	label,
	onClick,
	className = ''
}: CloseButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		aria-label={label}
		className={`rounded p-1 hover:bg-gray-100 ${className}`}
	>
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="size-3.5"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		>
			<path d="M6 6l12 12M18 6L6 18" />
		</svg>
	</button>
)
