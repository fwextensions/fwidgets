import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import {
	Button,
	Inline,
	Stack,
	Textbox,
	useInitialFocus,
} from "@create-figma-plugin/ui";
import JSX = h.JSX;
import Label from "@/fwidgets/components/Label";

interface InputTextProps {
	confirm: (text: string) => void;
	disabled?: boolean;
	label?: string;
	defaultText?: string;
	placeholder?: string;
	focused?: boolean;
}

export default function InputText({
		confirm,
		disabled = false,
		label = "",
		defaultText = "",
		placeholder = "",
		focused = false,
	}: InputTextProps)
{
	const [value, setValue] = useState(defaultText);
	const initialFocus = useInitialFocus();

	const handleInput = useCallback(
		(event: JSX.TargetedEvent<HTMLInputElement>) => setValue(event.currentTarget.value),
		[]
	);

	const handleConfirm = useCallback(
		() => confirm(value),
		[value]
	);

	const handleKeyDown = useCallback(
		(event: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter") {
				handleConfirm();
			}
		},
		[handleConfirm]
	);

	const nextButtonDisabled = disabled || !value;

	return (
		<Stack space="small">
			<Label text={label} />
			<Inline space="small">
				<Textbox
					variant="border"
					disabled={disabled}
					value={value}
					placeholder={placeholder}
					{...(focused ? initialFocus : {})}
					onInput={handleInput}
					onKeyDown={handleKeyDown}
				/>
				<Button
					disabled={nextButtonDisabled}
					onClick={handleConfirm}
				>
					Next
				</Button>
			</Inline>
		</Stack>
	);
}
