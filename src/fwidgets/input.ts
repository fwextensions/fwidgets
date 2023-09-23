import { call } from "figma-await-call";
import { FwidgetsCall } from "@/constants";

export function buttons(
	label: string,
	buttons: string[],
	options: object = {})
{
	return call<string>(FwidgetsCall, { type: "Buttons", options: { ...options, label, buttons } });
}

export function color(
	label: string = "",
	options: object = {})
{
	return call<string>(FwidgetsCall, { type: "Color", options: { ...options, label } });
}

export function dropdown(
	label: string,
	optionItems: string[],
	options: object = {})
{
	return call<string>(FwidgetsCall, { type: "Dropdown", options: { ...options, label, options: optionItems } });
}

export function text(
	label: string = "",
	options: object = {})
{
	return call<string>(FwidgetsCall, { type: "Text", options: { ...options, label } });
}
