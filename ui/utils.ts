export function keepName<T extends object>(
	fn: T,
	name: string)
{
		// override the function's name so that when it's minified, the name
		// doesn't change, which means we don't have to pass keepNames to esbuild
		// (which currently fails on Windows in cfp 3.0)
	Object.defineProperty(fn, "name", { value: name });

	return fn;
}
