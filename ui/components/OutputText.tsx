import { h } from "preact";
import { useEffect } from "preact/hooks";
import { Text } from "@create-figma-plugin/ui";

	// we have to set the first two of these properties to override the included
	// CSS and make the text selectable
const TextStyle = {
	userSelect: "text",
	pointerEvents: "auto",
	cursor: "auto",
};

interface OutputTextProps {
	confirm: (text: string) => void;
	text: string;
	numeric?: boolean;
	align?: "left"|"center"|"right";
}

export default function OutputText({
		confirm,
		text,
		numeric,
		align,
	}: OutputTextProps)
{
		// we're not waiting for any user input, so resolve the promise immediately
		// when we're mounted
	useEffect(
		() => confirm(""),
		[]
	);

	return (
		<Text
			numeric={numeric}
			align={align}
			style={TextStyle}
		>
			{text}
		</Text>
	);
}
