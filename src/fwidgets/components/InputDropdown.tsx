import { h } from "preact";
import JSX = h.JSX;
import { useCallback, useState } from "preact/hooks";
import {
	Button,
	Dropdown,
	Inline,
	Stack,
} from "@create-figma-plugin/ui";
import Label from "@/components/Label";

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
		<Stack space="small">
			<Label
				text={label}
				disabled={disabled}
			/>
			<Inline space="small">
				<Dropdown
					variant="border"
					disabled={disabled}
					options={options.map((value) => ({ value }))}
					value={value}
					placeholder={placeholder}
					onChange={handleChange}
				/>
				{ !disabled &&
					<Button
						disabled={!value}
						onClick={handleConfirm}
					>
						Next
					</Button>
				}
			</Inline>
		</Stack>
	);
}
