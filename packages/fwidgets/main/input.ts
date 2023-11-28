import { callFwidgets } from "./callFwidgets";

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
	return callFwidgets<RGBA>("InputColor", { ...options, label });
}

export function dropdown(
	label: string,
	items: string[],
	options: object = {})
{
	return callFwidgets("InputDropdown", { ...options, label, options: items });
}

export function number(
	label: string = "",
	options: object = {})
{
	return callFwidgets<number>("InputNumber", { ...options, label });
}

export async function page(
	label: string = "Select a page:",
	options: object = { placeholder: "Pages" })
{
	const pageNames = figma.root.children.map(({ name }) => name);
	const selectedPageName = await callFwidgets("InputDropdown", { ...options, label, options: pageNames });

	return figma.root.children.find(({ name }) => name === selectedPageName);
}

export function text(
	label: string = "",
	options: object = {})
{
	return callFwidgets("InputText", { ...options, label });
}
