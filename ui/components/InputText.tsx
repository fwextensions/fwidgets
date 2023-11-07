import { h } from "preact";
import JSX = h.JSX;
import { useCallback, useState } from "preact/hooks";
import { Textbox, useInitialFocus } from "@create-figma-plugin/ui";
import { keepName } from "../utils";
import InlineWidget from "./InlineWidget";

interface InputTextProps {
	confirm: (text: string | null) => void;
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
	const isValueValid = !!value;

	const handleInput = useCallback(
		(event: JSX.TargetedEvent<HTMLInputElement>) => setValue(event.currentTarget.value),
		[]
	);

	const handleConfirm = useCallback(
		() => isValueValid && confirm(value),
		[value]
	);

	const handleKeyDown = useCallback(
		(event: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter") {
				handleConfirm();
			} else if (event.key === "Escape") {
				confirm(null);
			}
		},
		[handleConfirm]
	);

	return (
		<InlineWidget
			label={label}
			disabled={disabled}
			nextEnabled={isValueValid}
			onNextClick={handleConfirm}
		>
			<Textbox
				variant="border"
				disabled={disabled}
				value={value}
				placeholder={placeholder}
				{...(focused ? initialFocus : {})}
				onInput={handleInput}
				onKeyDown={handleKeyDown}
			/>
		</InlineWidget>
	);
}

keepName(InputText, "InputText");
