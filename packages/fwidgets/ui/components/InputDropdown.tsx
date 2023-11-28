import { h } from "preact";
import JSX = h.JSX;
import { useCallback, useState } from "preact/hooks";
import { Dropdown, useInitialFocus } from "@create-figma-plugin/ui";
import { keepName } from "../utils";
import InlineWidget from "./InlineWidget";

interface InputDropdownProps {
	confirm: (text: string) => void;
	options: string[];
	disabled?: boolean;
	placeholder?: string;
	label?: string;
	focused?: boolean;
}

export default function InputDropdown({
		confirm,
		options,
		disabled = false,
		placeholder = "Select an item",
		label = "",
		focused = false,
	}: InputDropdownProps)
{
	const [value, setValue] = useState<string|null>(null);
	const initialFocus = useInitialFocus();
	const isValueValid = !!value;

	const handleChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

	const handleConfirm = useCallback(
		() => isValueValid && confirm(value ?? ""),
		[value]
	);

	return (
		<InlineWidget
			label={label}
			disabled={disabled}
			nextEnabled={isValueValid}
			onNextClick={handleConfirm}
		>
			<Dropdown
				variant="border"
				disabled={disabled}
				options={options.map((value) => ({ value }))}
				value={value}
				placeholder={placeholder}
				{...(focused ? initialFocus : {})}
				onChange={handleChange}
			/>
		</InlineWidget>
	);
}

keepName(InputDropdown, "InputDropdown");
