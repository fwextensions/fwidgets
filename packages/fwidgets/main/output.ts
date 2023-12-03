import { callFwidgets } from "./callFwidgets";

type ClipboardOptions = {
	message?: string;
	error?: boolean;
	timeout?: number;
}

export function clipboard(
	value: unknown,
	options: ClipboardOptions = {})
{
	const { message, error, timeout } = options;
	const text = (value && typeof value === "object")
		? JSON.stringify(value, null, "\t")
		: String(value);

	if (message) {
		figma.notify(message, { error, timeout });
	}

		// pass true to make callFwidgets() call showMinimized() instead of show(),
		// so that we use a minimal window to do the copying
	return callFwidgets<undefined>(
		"OutputClipboard",
		{ ...options, text },
		true
	);
}

export function text(
	text: unknown,
	options: object = {})
{
	return callFwidgets<undefined>("OutputText", { ...options, text });
}
