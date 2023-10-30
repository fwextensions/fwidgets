import { h } from "preact";
import JSX = h.JSX;
import { useCallback, useState } from "preact/hooks";
import { Dropdown } from "@create-figma-plugin/ui";
import InlineWidget from "./InlineWidget";

interface InputDropdownProps {
	confirm: (text: string) => void;
	options: string[];
	disabled?: boolean;
	placeholder?: string;
	label?: string;
}

export default function InputDropdown({
		confirm,
		options,
		disabled = false,
		placeholder = "Select an item",
		label = "",
	}: InputDropdownProps)
{
	const [value, setValue] = useState<string|null>(null);

	const handleChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

	const handleConfirm = useCallback(
		() => confirm(value ?? ""),
		[value]
	);

	return (
		<InlineWidget
			label={label}
			disabled={disabled}
			nextEnabled={!!value}
			onNextClick={handleConfirm}
		>
			<Dropdown
				variant="border"
				disabled={disabled}
				options={options.map((value) => ({ value }))}
				value={value}
				placeholder={placeholder}
				onChange={handleChange}
			/>
		</InlineWidget>
	);
}
