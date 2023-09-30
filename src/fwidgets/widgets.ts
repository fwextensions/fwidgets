import { h } from "preact";
import { DeferredPromise } from "figma-await-call";
import InputButtons from "@/components/InputButtons";
import InputColor from "@/components/InputColor";
import InputDropdown from "@/components/InputDropdown";
import InputNumber from "@/components/InputNumber";
import InputText from "@/components/InputText";
import OutputClipboard from "@/components/OutputClipboard";
import OutputText from "@/components/OutputText";

const componentList = [
	InputButtons,
	InputColor,
	InputDropdown,
	InputNumber,
	InputText,
	OutputClipboard,
	OutputText,
] as const;

const components: Record<string, typeof componentList[number]> = componentList.reduce((result, component) => ({
	...result,
	[component.name]: component
}), {});

export interface WidgetCall {
	type: keyof typeof components;
	options?: Record<string, unknown>;
}

export interface WidgetSpec extends WidgetCall {
	deferred: DeferredPromise<unknown>;
}

export function createWidgetSpec(
	data: WidgetCall): WidgetSpec
{
	if (!data || typeof data !== "object") {
		throw new Error(`Unrecognized widget data: ${data}.`);
	}

	const { type, options } = data;

	if (!(type in components)) {
		throw new Error(`Unrecognized widget type: ${type}.`);
	}

	return {
		type,
		options,
		deferred: new DeferredPromise()
	};
}

export function createWidgetElement(
	spec: WidgetSpec,
	focused: boolean,
	confirm: (text: string) => void)
{
	const { type, options } = spec;
	const Component = components[type];

		// we can't seem to use <Component /> here to instantiate an element, so use
		// h() directly like React.createElement()
	return h<any>(
		Component,
		{
			focused,
			confirm,
			...options
		}
	);
// TODO: this seems in the right direction, but still shows TS errors
//	return h<ComponentProps<typeof Component>>(
//		Component,
//		{
//			focused,
//			confirm,
//			...options
//		}
//	);
}
