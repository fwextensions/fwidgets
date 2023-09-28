import { callFwidgets } from "@/utils";

export function buttons(
	label: string,
	buttons: string[],
	options: object = {})
{
	return callFwidgets("InputButtons", { ...options, label, buttons });
}

export function color(
	label: string = "",
	options: object = {})
{
	return callFwidgets("InputColor", { ...options, label });
}

export function dropdown(
	label: string,
	optionItems: string[],
	options: object = {})
{
	return callFwidgets("InputDropdown", { ...options, label, options: optionItems });
}

export function number(
	label: string = "",
	options: object = {})
{
	return callFwidgets<number>("InputNumber", { ...options, label });
}

export function text(
	label: string = "",
	options: object = {})
{
	return callFwidgets("InputText", { ...options, label });
}
