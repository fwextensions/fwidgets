import { DeferredPromise } from "figma-await-call";
import { callFwidgets } from "./callFwidgets";

export function clipboard(
	text: string): DeferredPromise<undefined>
{
	return callFwidgets<undefined>("OutputClipboard", { text });
}

export function text(
	text: unknown,
	options: object = {}): DeferredPromise<undefined>
{
	return callFwidgets<undefined>("OutputText", { ...options, text });
}
