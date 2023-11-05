import { fwidgets } from "fwidgets/main";

// all of your plugin code should be in the callback passed to fwidgets().  your
// callback will be passed input, output and ui modules that contain functions
// you can use to display UI controls for the plugin, one at a time.
export default fwidgets(async ({ input, output, ui }) => {
	// you can set the size of the plugin window
	ui.setSize({
		width: 300,
		height: 250
	});

	// the color picker returns an RGBA object, but we only need the RGB here
	const { a, ...rgb } = await input.color("Rectangle fill color:");

	// limit the user to entering integers from 1 to 10
	const count = await input.number("Number of rectangles:", {
		placeholder: "Count",
		minimum: 1,
		maximum: 10,
		integer: true
	});

	// let the user cancel before creating any rectangles
	const button = await input.buttons("Continue?", [
		"Create Rectangles",
		"Cancel"
	]);

	if (button === "Cancel") {
		return;
	}

	const nodes: Array<SceneNode> = [];

	// create the rectangles with the color and number specified by the user
	for (let i = 0; i < count; i++) {
		const rect = figma.createRectangle();

		rect.x = figma.viewport.center.x + i * 150;
		rect.fills = [{ type: "SOLID", color: rgb }];
		figma.currentPage.appendChild(rect);
		nodes.push(rect);
	}

	figma.currentPage.selection = nodes;
	figma.viewport.scrollAndZoomIntoView(nodes);

	// collect the position and size of each rectangle
	const rectInfo = nodes.map(({ x, y, width: w, height: h }) => ({ x, y, w, h }));

	// copy the info to the clipboard as JSON
	await output.clipboard(rectInfo);

	// return a message to show in a toast after the plugin closes
	return `${count} rectangles copied to the clipboard.`
});
