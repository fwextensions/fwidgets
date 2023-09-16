import { call } from "figma-await-call";
import { FwidgetsEvent } from "@/constants";

export function text(
	label: string = "",
	options: object = {})
{
	return call<string>(FwidgetsEvent, { type: "text", options: { ...options, label } });
}

export function buttons(
	label: string,
	buttons: string[],
	options: object = {})
{
	return call<string>(FwidgetsEvent, { type: "buttons", options: { ...options, label, buttons } });
}

export function dropdown(
	label: string,
	optionItems: string[],
	options: object = {})
{
	return call<string>(FwidgetsEvent, { type: "dropdown", options: { ...options, label, options: optionItems } });
}
