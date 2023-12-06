import { fwidgets } from "fwidgets/main";

function createRectangles(
	count: number,
	color: RGB)
{
	const nodes: Array<SceneNode> = [];

	for (let i = 0; i < count; i++) {
		const rect = figma.createRectangle();

		rect.x = figma.viewport.center.x + i * 150;
		rect.fills = [{ type: "SOLID", color }];
		figma.currentPage.appendChild(rect);
		nodes.push(rect);
	}

	figma.currentPage.selection = nodes;
	figma.viewport.scrollAndZoomIntoView(nodes);

	return nodes;
}

// all of the code that interacts with the plugin UI should be triggered from
// within the callback passed to fwidgets(), since the plugin window is closed
// when the callback returns.  it will be passed input, output and ui modules
// that contain functions you can use to display UI controls, one at a time.
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
		// returning from this function automatically closes the plugin window
		return;
	}

	// create the rectangles with the color and number specified by the user
	const rects = createRectangles(count, rgb);

	// collect the position and size of each rectangle node
	const rectInfo = rects.map(({ x, y, width: w, height: h }) => ({ x, y, w, h }));

	// copy the info to the clipboard as JSON
	await output.clipboard(rectInfo);

	// return a message to show in a toast after the plugin closes
	return `${count} rectangles copied to the clipboard.`
});
