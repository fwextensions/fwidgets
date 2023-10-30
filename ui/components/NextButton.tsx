import { h, JSX } from "preact";
import { Button } from "@create-figma-plugin/ui";

interface NextButtonProps {
	onClick: JSX.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	hidden?: boolean;
}

export default function NextButton({
		onClick,
		disabled = false,
		hidden = false,
	}: NextButtonProps)
{
	if (hidden) {
		return null;
	}

	return (
		<Button
			disabled={disabled}
			onClick={onClick}
		>
			Next
		</Button>
	);
}
