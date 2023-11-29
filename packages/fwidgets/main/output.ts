import * as ui from "./ui";
import { callFwidgets } from "./callFwidgets";
import { show } from "./ui";

type ClipboardOptions = {
	message?: string;
	error?: boolean;
	timeout?: number;
}

export async function clipboard(
	value: unknown,
	options: ClipboardOptions = {})
{
	const { message, error, timeout } = options;
	const windowWasOpen = ui.isOpen();
	const windowSize = ui.getSize();
	const { x, y, width, height } = figma.viewport.bounds;
	let text;

	if (value && typeof value === "object") {
		text = JSON.stringify(value, null, "\t");
	} else {
		text = String(value);
	}

	if (!windowWasOpen) {
			// the viewport width/height doesn't include the side panels, and we don't
			// know how big those are.  so multiply the width/height to force the
			// plugin window as far down and to the right as it'll go.
		show({ width: 0, height: 0 }, { x: x + width * 5, y: y + height * 5 });
	}

	const result = await callFwidgets<undefined>("OutputClipboard", { ...options, text });

	if (!windowWasOpen) {
		ui.hide();
		ui.setSize(windowSize);
	}

	if (message) {
		figma.notify(message, { error, timeout });
	}

	return result;
}

export function text(
	text: unknown,
	options: object = {})
{
	return callFwidgets<undefined>("OutputText", { ...options, text });
}
