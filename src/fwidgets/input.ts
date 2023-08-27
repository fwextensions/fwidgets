import { call } from "@/utils/call";
import { FwidgetsEvent } from "@/fwidgets/constants";

export function text(
	label: string = "",
	options: object = {})
{
	return call(FwidgetsEvent, { type: "text", options: { ...options, label } });
}

export function buttons(
	label: string,
	buttons: string[],
	options: object = {})
{
	return call(FwidgetsEvent, { type: "buttons", options: { ...options, label, buttons } });
}
