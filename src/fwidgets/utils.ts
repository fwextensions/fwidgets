import { show } from "@/ui";
import { call } from "figma-await-call";
import { FwidgetsCall } from "@/constants";

export function callFwidgets<T = string>(
	type: string,
	options: object)
{
	show();

	return call<T>(FwidgetsCall, { type, options });
}
