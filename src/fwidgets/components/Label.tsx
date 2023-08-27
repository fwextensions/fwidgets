import { h } from "preact";
import { Text } from "@create-figma-plugin/ui";

interface LabelProps {
	text?: string;
}

export default function Label({
	text = "" }: LabelProps)
{
	if (!text) {
		return null;
	}

	return (
		<Text muted>
			{text}
		</Text>
	);
}
