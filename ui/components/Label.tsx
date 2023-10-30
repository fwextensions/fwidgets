import { h } from "preact";
import { Text } from "@create-figma-plugin/ui";

interface LabelProps {
	text?: string;
	disabled?: boolean;
}

export default function Label({
	text = "",
	disabled = false }: LabelProps)
{
	if (!text) {
		return null;
	}

	const style = disabled
		? { color: "var(--figma-color-text-disabled)" }
		: undefined;

	return (
		<Text muted
			style={style}
		>
			{text}
		</Text>
	);
}
