module.exports = (buildOptions) => ({
	...buildOptions,
		// we need to set this to true to maintain the component function names that
		// we use to specify which component to render when making a call from the
		// main thread, like "InputButtons" vs. "OutputClipboard"
	keepNames: true,
});
