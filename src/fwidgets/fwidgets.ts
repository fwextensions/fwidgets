import * as input from "./input";
import { setSize } from "./ui";

const Modules = {
	input,
	setSize,
} as const;

type MainFunction = (modules: typeof Modules) => Promise<string|void>;

export default async function fwidgets(
	main: MainFunction)
{
	const result = await main(Modules);

	figma.closePlugin(result ?? "");
}
