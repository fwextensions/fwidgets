import { callFwidgets } from "./callFwidgets";

export function clipboard(
	value: unknown)
{
	let text = String(value);

	if (value && typeof value === "object") {
		text = JSON.stringify(value, null, "\t");
	}

	return callFwidgets<undefined>("OutputClipboard", { text });
}

export function text(
	text: unknown,
	options: object = {})
{
	return callFwidgets<undefined>("OutputText", { ...options, text });
}
