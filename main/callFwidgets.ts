import { call } from "figma-await-call";
import { FwidgetsCall } from "../shared/constants";
import { show } from "./ui";

export function callFwidgets<T = string>(
	type: string,
	options: object)
{
	show();

	return call<T>(FwidgetsCall, { type, options });
}
