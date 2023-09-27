import { h } from "preact";
import JSX = h.JSX;
import { useCallback, useState } from "preact/hooks";
import { TextboxColor, useInitialFocus } from "@create-figma-plugin/ui";
import InlineWidget from "@/components/InlineWidget";

interface InputColorProps {
	confirm: (color: [string, string]) => void;
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
	const initialFocus = useInitialFocus();

	const handleHexColorInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setHexColor(event.currentTarget.value);
  };

	const handleOpacityInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setOpacity(event.currentTarget.value);
  };

	const handleConfirm = useCallback(
		() => hexColor && opacity && confirm([hexColor, opacity]),
		[hexColor, opacity]
	);

	return (
		<InlineWidget
			label={label}
			disabled={disabled}
			nextEnabled={!!(hexColor && opacity)}
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
			/>
		</InlineWidget>
	);
}
