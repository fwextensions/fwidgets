import { h } from "preact";
import JSX = h.JSX;
import { useCallback, useState } from "preact/hooks";
import { TextboxMultiline, useInitialFocus } from "@create-figma-plugin/ui";
import { keepName } from "../utils";
import InlineWidget from "./InlineWidget";

interface InputTextProps {
	confirm: (text: string | null) => void;
	disabled?: boolean;
	label?: string;
	defaultText?: string;
	placeholder?: string;
	focused?: boolean;
	grow?: boolean;
	rows?: number;
}

type InputEvent = JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement>;
type KeyboardEvent = JSX.TargetedKeyboardEvent<HTMLInputElement | HTMLTextAreaElement>;

export default function InputText({
		confirm,
		disabled = false,
		label = "",
		defaultText = "",
		placeholder = "",
		focused = false,
		grow = true,
		rows = 1,
	}: InputTextProps)
{
	const [value, setValue] = useState(defaultText);
	const initialFocus = useInitialFocus();
	const isValueValid = !!value;

	const handleInput = useCallback(
		(event: InputEvent) => setValue(event.currentTarget.value),
		[]
	);

	const handleConfirm = useCallback(
		() => isValueValid && confirm(value),
		[value]
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
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
			<TextboxMultiline
				variant="border"
				grow={grow}
				rows={rows}
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
