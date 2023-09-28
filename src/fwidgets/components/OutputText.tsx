import { h } from "preact";
import { useEffect } from "preact/hooks";
import { Text } from "@create-figma-plugin/ui";

interface InputTextProps {
	confirm: (text: string) => void;
	text: string;
}

export default function OutputText({
		confirm,
		text,
	}: InputTextProps)
{
		// we're not waiting for any user input, so resolve the promise immediately
		// when we're mounted
	useEffect(
		() => confirm(""),
		[]
	);

	return (
		<Text>
			{text}
		</Text>
	);
}
