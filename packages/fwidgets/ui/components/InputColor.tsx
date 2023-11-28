import { h } from "preact";
import JSX = h.JSX;
import { useCallback, useState } from "preact/hooks";
import { TextboxColor, useInitialFocus } from "@create-figma-plugin/ui";
import { keepName } from "../utils";
import InlineWidget from "./InlineWidget";

const DefaultRGBA = { r: 0, g: 0, b: 0, a: 1 };

interface InputColorProps {
	confirm: (color: RGBA | null) => void;
	disabled?: boolean;
	placeholder?: string;
	label?: string;
	focused?: boolean;
}

export default function InputColor({
		confirm,
		disabled = false,
		placeholder = "Select an item",
		label = "",
		focused = false,
	}: InputColorProps)
{
	const [hexColor, setHexColor] = useState<string>("000000");
	const [opacity, setOpacity] = useState<string>("100%");
	const [rgbaColor, setRgbaColor] = useState<RGBA | null>(DefaultRGBA);
	const initialFocus = useInitialFocus();
	const isValueValid = !!rgbaColor;

	const handleHexColorInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
		setHexColor(event.currentTarget.value);
	};

	const handleOpacityInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
		setOpacity(event.currentTarget.value);
	};

	const handleRGBAInput = (rgba: RGBA | null) => {
		setRgbaColor(rgba);
	};

	const handleConfirm = useCallback(
		() => isValueValid && confirm(rgbaColor),
		[hexColor, opacity]
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
			<TextboxColor
				variant="border"
				disabled={disabled}
				{...(focused ? initialFocus : {})}
				hexColor={hexColor}
				opacity={opacity}
				hexColorPlaceholder={placeholder}
				onHexColorInput={handleHexColorInput}
				onOpacityInput={handleOpacityInput}
				onRgbaColorValueInput={handleRGBAInput}
				onHexColorKeyDown={handleKeyDown}
				onOpacityKeyDown={handleKeyDown}
			/>
		</InlineWidget>
	);
}

keepName(InputColor, "InputColor");
