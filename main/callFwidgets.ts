import { call } from "figma-await-ipc";
import { FwidgetsCall } from "../shared/constants";
import { show } from "./ui";

export async function callFwidgets<T = string>(
	type: string,
	options: object)
{
//	const { x, width } = figma.viewport.bounds;
//
//console.log(figma.viewport.bounds, Math.floor(figma.viewport.bounds.width / 2));
//	show(undefined, null);
////	show(undefined, { x: 0, y: 0 });
////	show(undefined, { x: 100000, y: 100000 });
////	show(undefined, { x: x + Math.floor(width / 2), y: 0 });
	show();

	const result = await call<T>(FwidgetsCall, { type, options });

	if (result === null) {
			// null means esc was pressed, so for now, just throw an empty error that
			// will be caught by fwidgets() and close the plugin with no message
		throw new Error();
	}

	return result;
}
