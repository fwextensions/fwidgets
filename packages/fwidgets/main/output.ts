import * as ui from "./ui";
import { callFwidgets } from "./callFwidgets";
import { show } from "./ui";

export async function clipboard(
	value: unknown)
{
	const windowWasOpen = ui.isOpen();
	const windowSize = ui.getSize();
	const { x, y, width, height } = figma.viewport.bounds;
	let text = String(value);

	if (value && typeof value === "object") {
		text = JSON.stringify(value, null, "\t");
	}

	if (!windowWasOpen) {
		show({ width: 0, height: 0 }, { x: x + width * 10, y: y + height * 10 });
console.log("showing in clipboard", figma.viewport.bounds);
	}

	const result = await callFwidgets<undefined>("OutputClipboard", { text });

	if (!windowWasOpen) {
		ui.hide();
		ui.setSize(windowSize);
	}

	return result;
//	return callFwidgets<undefined>("OutputClipboard", { text });
}

export function text(
	text: unknown,
	options: object = {})
{
	return callFwidgets<undefined>("OutputText", { ...options, text });
}
