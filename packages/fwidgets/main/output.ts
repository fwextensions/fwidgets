import { call } from "figma-await-ipc";
import { FwidgetsCall } from "../shared/constants";
import { callFwidgets } from "./callFwidgets";
import { showMinimized } from "./ui";

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
	let text;

	if (value && typeof value === "object") {
		text = JSON.stringify(value, null, "\t");
	} else {
		text = String(value);
	}

	showMinimized();

		// since we want to call showMinimized() instead of show(), which
		// callFwidgets() does by default, we have to use call() directly
	const result = await call<undefined>(FwidgetsCall, {
		type: "OutputClipboard",
		options: { text }
	});

	if (message) {
		figma.notify(message, { error, timeout });
	}

	if (result === null) {
			// null means esc was pressed, so for now, just throw an empty error that
			// will be caught by fwidgets() and close the plugin with no message
		throw new Error();
	}

	return result;
}

export function text(
	text: unknown,
	options: object = {})
{
	return callFwidgets<undefined>("OutputText", { ...options, text });
}
