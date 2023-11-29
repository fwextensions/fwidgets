import { call } from "figma-await-ipc";
import { FwidgetsCall } from "../shared/constants";
import { show } from "./ui";

export async function callFwidgets<T = string>(
	type: string,
	options: object)
{
	show();

	const result = await call<T>(FwidgetsCall, { type, options });

	if (result === null) {
			// null means esc was pressed, so for now, just throw an empty error that
			// will be caught by fwidgets() and close the plugin with no message
		throw new Error();
	}

	return result;
}
