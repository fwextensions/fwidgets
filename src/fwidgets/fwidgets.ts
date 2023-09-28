import * as input from "./input";
import * as output from "./output";
import { setSize } from "./ui";

const Modules = {
	input,
	output,
	setSize,
} as const;

type MainFunction = (modules: typeof Modules) => Promise<string|void>;

export default async function fwidgets(
	main: MainFunction)
{
	const result = await main(Modules);

	figma.closePlugin(result ?? "");
}
