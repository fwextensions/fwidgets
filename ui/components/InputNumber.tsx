import { h } from "preact";
import JSX = h.JSX;
import { useCallback, useState } from "preact/hooks";
import { TextboxNumeric, useInitialFocus } from "@create-figma-plugin/ui";
import InlineWidget from "./InlineWidget";

interface InputNumberProps {
	confirm: (value: number) => void;
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
		defaultValue = "",
		placeholder,
		suffix,
		incrementSmall,
		incrementBig,
		minimum,
		maximum,
		integer = false,
		focused = false,
	}: InputNumberProps)
{
	const [value, setValue] = useState(defaultValue);
	const initialFocus = useInitialFocus();

	const handleInput = useCallback(
		(event: JSX.TargetedEvent<HTMLInputElement>) => setValue(event.currentTarget.value),
		[]
	);

	const handleConfirm = useCallback(
		() => confirm(parseFloat(value)),
		[value]
	);

	return (
		<InlineWidget
			label={label}
			disabled={disabled}
			nextEnabled={!!value}
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
			/>
		</InlineWidget>
	);
}
