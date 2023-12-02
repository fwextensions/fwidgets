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
	const showUIOptions = {};

	if (size) {
		windowSize = { ...size };
		Object.assign(showUIOptions, size);

		if (isUIOpen) {
			figma.ui.resize(size.width, size.height);
		}
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

		Object.assign(showUIOptions, {
			...windowSize,
			position: {
				x: vpX,
				y: vpY,
			}
		});

		if (isUIOpen) {
			figma.ui.resize(windowSize.width, windowSize.height);
			figma.ui.reposition(vpX, vpY);
		}

		isUIMinimized = false;
	}

	if (position) {
		const { x, y } = figma.viewport.bounds;

		windowPosition = { ...position };
		Object.assign(showUIOptions, {
			position: {
				x: x + position.x / zoom,
				y: y + position.y / zoom,
			}
		});

		if (isUIOpen) {
			figma.ui.reposition(position.x, position.y);
		}
	}

	isUIVisible = true;

	if (!isUIOpen) {
		isUIOpen = true;
		showUI(showUIOptions);
	} else {
		figma.ui.show();
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
	windowSize = size;

	if (isUIOpen) {
		figma.ui.resize(size.width, size.height);
	}
}

export function setPosition(
	size: WindowSize)
{
	windowSize = size;

	if (isUIOpen) {
		figma.ui.resize(size.width, size.height);
	}
}

export const isOpen = () => isUIOpen;
export const isVisible = () => isUIVisible;
export const getSize = () => ({ ...windowSize });
export const getPosition = () => (windowPosition ? { ...windowPosition } : null);
