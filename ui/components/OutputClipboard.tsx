import { useEffect } from "preact/hooks";
import { keepName } from "../utils";

function copyTextToClipboard(
	text: string)
{
	const copyFrom = document.createElement("textarea");
	const { body, activeElement } = document;
	let result = true;

	copyFrom.textContent = text;
	body.appendChild(copyFrom);
	copyFrom.focus({ preventScroll: true });
	copyFrom.select();

	if (!document.execCommand("copy")) {
		result = false;
	}

		// now that the selected text is copied, remove the copy source
	body.removeChild(copyFrom);

	if (activeElement) {
			// refocus the previously active element, since we stole the
			// focus to copy the text from the temp textarea
		(activeElement as HTMLElement).focus({ preventScroll: true });
	}

	return result;
}

interface OutputClipboardProps {
	confirm: (text: string) => void;
	text: string;
}

export default function OutputClipboard({
		confirm,
		text
	}: OutputClipboardProps)
{
		// we're not waiting for any user input, so resolve the promise immediately
		// when we're mounted
	useEffect(
		() => confirm(String(copyTextToClipboard(text))),
		[]
	);

	return null;
}

keepName(OutputClipboard, "OutputClipboard");
