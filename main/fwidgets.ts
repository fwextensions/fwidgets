import * as input from "./input";
import * as output from "./output";
import * as ui from "./ui";

const Modules = {
	input,
	output,
	ui,
} as const;

type MainFunction = (modules: typeof Modules) => Promise<string|void>;

export function fwidgets(
	main: MainFunction)
{
		// wrap the call to the user's function in another function, so they can
		// just use `export default fwidgets(...)`
	return () => main(Modules)
			// use a then handler so we don't have to make fwidgets an async function
		.then((result) => figma.closePlugin(result ?? ""))
		.catch((error) => figma.closePlugin(error.message));
}
