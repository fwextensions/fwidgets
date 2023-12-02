import { showUI } from "@create-figma-plugin/utilities";

type WindowSize = {
	width: number;
	height: number;
};
type WindowPosition = null | {
	x: number;
	y: number;
};
type ShowOptions = {
	size?: WindowSize;
	position?: WindowPosition;
};

const DefaultSize: WindowSize = {
	width: 300,
	height: 200,
};
const HeaderHeight = 40;

let windowSize = { ...DefaultSize };
let windowPosition: WindowPosition = null;
let isUIOpen = false;
let isUIVisible = false;
let isUIMinimized = false;

export function show({
		size,
		position,
	}: ShowOptions = {})
{
	const { zoom } = figma.viewport;
		// default to showing the window at its saved size
	let targetSize = { ...windowSize };
	let targetPosition;

	if (size) {
		targetSize = windowSize = { ...size };
	}

	if (isUIMinimized) {
			// since the plugin is currently minimized, its position and size have
			// been set to a little window in the bottom-right corner.  ideally, we'd
			// now show it at its full size and previous position, but that's been
			// lost, since we programmatically set the position.  so the best we can
			// do is center it on the viewport by converting the target plugin window
			// size and position into viewport units.
		const { x, y, width, height } = figma.viewport.bounds;
		const vpW = windowSize.width / zoom;
		const vpH = (HeaderHeight + windowSize.height) / zoom;
		const vpX = x + (width - vpW) / 2;
		const vpY = y + (height - vpH) / 2;

		targetPosition = {
			x: vpX,
			y: vpY,
		};
		isUIMinimized = false;
	}

		// check position after isUIMinimized so that the position param can override
		// the centering that's done in the block above
	if (position) {
		const { x, y } = figma.viewport.bounds;

		windowPosition = { ...position };
		targetPosition = {
			x: x + position.x / zoom,
			y: y + position.y / zoom,
		};
	}

	isUIVisible = true;

	if (isUIOpen) {
		if (targetSize) {
			figma.ui.resize(targetSize.width, targetSize.height);
		}

		if (targetPosition) {
			figma.ui.reposition(targetPosition.x, targetPosition.y);
		}

		figma.ui.show();
	} else {
		isUIOpen = true;
		showUI({
			...targetSize,
			...(targetPosition ? { position: targetPosition } : null)
		});
	}
}

export function showMinimized()
{
	if (isUIVisible) {
			// if the window is currently visible, there's no reason to minimize it
		return;
	}

	const { x, y, width, height } = figma.viewport.bounds;
	const size = { width: 0, height: 0 };
		// we don't know how wide the side panels around the viewport are, so
		// multiply the viewport width/height so that we force the plugin window to
		// the bottom-right corner, behind the help button
	const position = { x: x + width * 5, y: y + height * 5 };

	isUIMinimized = true;
	isUIVisible = true;

	showUI({ ...size, position });
}

export function hide()
{
	isUIVisible = false;

	if (isUIOpen) {
		isUIOpen = false;
		figma.ui.hide();
	}
}

export function setSize(
	size: WindowSize)
{
	windowSize = { ...size };

	if (isUIOpen) {
		figma.ui.resize(size.width, size.height);
	}
}

export function setPosition(
	position: WindowPosition)
{
	if (position) {
		windowPosition = { ...position };

		if (isUIOpen) {
			const { zoom, bounds: { x, y } } = figma.viewport;

			figma.ui.reposition(
				x + position.x / zoom,
				y + position.y / zoom
			);
		}
	} else {
		windowPosition = null;
	}
}

export const isOpen = () => isUIOpen;
export const isVisible = () => isUIVisible;
export const getSize = () => ({ ...windowSize });
export const getPosition = () => (windowPosition ? { ...windowPosition } : null);
