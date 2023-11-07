import { h } from "preact";
import JSX = h.JSX;
import { useCallback, useState } from "preact/hooks";
import { TextboxNumeric, useInitialFocus } from "@create-figma-plugin/ui";
import { keepName } from "../utils";
import InlineWidget from "./InlineWidget";

interface InputNumberProps {
	confirm: (value: number | null) => void;
	disabled?: boolean;
	label?: string;
	defaultValue?: string;
	placeholder?: string;
	suffix?: string;
	incrementSmall?: number;
	incrementBig?: number;
	minimum?: number;
	maximum?: number;
	integer?: boolean;
	focused?: boolean;
}

export default function InputNumber({
		confirm,
		disabled = false,
		label = "",
		placeholder,
		suffix,
		incrementSmall,
		incrementBig,
		minimum,
		maximum,
		defaultValue = Number.isFinite(minimum) ? String(minimum) : "",
		integer = false,
		focused = false,
	}: InputNumberProps)
{
	const [value, setValue] = useState(defaultValue);
	const initialFocus = useInitialFocus();
	const isValueValid = !!value;

	const handleInput = useCallback(
		(event: JSX.TargetedEvent<HTMLInputElement>) => setValue(event.currentTarget.value),
		[]
	);

	const handleConfirm = useCallback(
		() => isValueValid && confirm(parseFloat(value)),
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
			<TextboxNumeric
				variant="border"
				disabled={disabled}
				value={value}
				placeholder={placeholder}
				{...(focused ? initialFocus : {})}
				suffix={suffix}
				incrementSmall={incrementSmall}
				incrementBig={incrementBig}
				minimum={minimum}
				maximum={maximum}
				integer={integer}
				onInput={handleInput}
				onKeyDown={handleKeyDown}
			/>
		</InlineWidget>
	);
}

keepName(InputNumber, "InputNumber");
