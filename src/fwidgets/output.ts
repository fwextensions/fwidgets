import { callFwidgets } from "@/utils";
import { DeferredPromise } from "figma-await-call";

export function text(
	text: string = "",
	options: object = {}): DeferredPromise<undefined>
{
	return callFwidgets<undefined>("OutputText", { ...options, text });
}
