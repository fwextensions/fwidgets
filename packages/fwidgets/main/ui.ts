import { showUI } from "@create-figma-plugin/utilities";

type WindowSize = {
	width: number;
	height: number;
};
type WindowPosition = null | {
	x: number;
	y: number;
}

const DefaultSize: WindowSize = {
	width: 300,
	height: 200,
};

let windowSize = { ...DefaultSize };
let windowPosition: WindowPosition = null;
let isUIOpen = false;
let isUIVisible = false;

export function show(
	size?: WindowSize,
	position?: WindowPosition)
//	size?: WindowSize)
{
	if (size) {
		windowSize = { ...size };

		if (isUIOpen) {
			figma.ui.resize(size.width, size.height);
		}
	}

	if (position) {
		windowPosition = { ...position };

		if (isUIOpen) {
			figma.ui.reposition(position.x, position.y);
		}
	}

	isUIVisible = true;

	if (!isUIOpen) {
		isUIOpen = true;
		showUI({ ...windowSize, ...(position ? { position } : {}) });
//		showUI(windowSize);
	} else {
		figma.ui.show();
	}
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
