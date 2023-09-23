import { h, FunctionComponent } from "preact";
import { DeferredPromise } from "figma-await-call";
import InputButtons from "@/components/InputButtons";
import InputColor from "@/components/InputColor";
import InputDropdown from "@/components/InputDropdown";
import InputText from "@/components/InputText";

const InputPattern = /^Input/;

const componentList = [
	InputButtons,
	InputColor,
	InputDropdown,
	InputText,
] as const;

const components: Record<string, FunctionComponent> = componentList.reduce((result, component) => ({
	...result,
	[component.name.replace(InputPattern, "")]: component
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

export function createWidgetComponent(
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
}
