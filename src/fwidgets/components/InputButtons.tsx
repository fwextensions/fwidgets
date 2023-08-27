import { h } from "preact";
import {
	Button,
	Inline,
	Stack,
	useInitialFocus
} from "@create-figma-plugin/ui";
import Label from "@/fwidgets/components/Label";

interface ButtonProps {
	label: string;
	value?: any;
}

interface InputButtonProps {
	confirm: (text: string) => void;
	buttons: string[];
//	buttons: (string|ButtonProps)[];
	disabled?: boolean;
	label?: string;
}

export default function InputButtons({
		confirm,
		buttons,
		disabled = false,
		label = "",
	}: InputButtonProps)
{
	const initialFocus = useInitialFocus();

	const buttonElements = buttons.map((label, i) => (
		<Button
			key={i}
			disabled={disabled}
			secondary
			{...(i === 0 ? initialFocus : {})}
			onClick={() => confirm(label)}
		>
			{label}
		</Button>
	));

	return (
		<Stack space="small">
			<Label text={label} />
			<Inline space="small">
				{buttonElements}
			</Inline>
		</Stack>
	);
}
