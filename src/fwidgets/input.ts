import { call } from "figma-await-call";
import { FwidgetsCall } from "@/constants";
import { show } from "@/ui";

function callFwidgets(
	type: string,
	options: object)
{
	show();

	return call<string>(FwidgetsCall, { type, options });
}

export function buttons(
	label: string,
	buttons: string[],
	options: object = {})
{
	return callFwidgets("Buttons", { ...options, label, buttons });
}

export function color(
	label: string = "",
	options: object = {})
{
	return callFwidgets("Color", { ...options, label });
}

export function dropdown(
	label: string,
	optionItems: string[],
	options: object = {})
{
	return callFwidgets("Dropdown", { ...options, label, options: optionItems });
}

export function text(
	label: string = "",
	options: object = {})
{
	return callFwidgets("Text", { ...options, label });
}
