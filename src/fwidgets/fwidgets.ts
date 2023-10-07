import { input, output, ui } from ".";

const Modules = {
	input,
	output,
	ui,
} as const;

type MainFunction = (modules: typeof Modules) => Promise<string|void>;

export default function fwidgets(
	main: MainFunction)
{
		// use a then handler so we don't have to make fwidgets an async function
	main(Modules)
		.then((result) => figma.closePlugin(result ?? ""))
		.catch((error) => figma.closePlugin(error));
}
