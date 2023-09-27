import { showUI } from "@create-figma-plugin/utilities";

type WindowSize = {
	width: number;
	height: number;
}

const DefaultSize: WindowSize = {
	width: 300,
	height: 200,
};

let windowSize = { ...DefaultSize };
let isUIOpen = false;
let isUIVisible = false;

export function show(
	size?: WindowSize)
{
	if (size) {
		if (isUIOpen) {
			figma.ui.resize(size.width, size.height);
		} else {
			windowSize = size;
		}
	}

	isUIVisible = true;

	if (!isUIOpen) {
		isUIOpen = true;
		showUI(windowSize);

// TODO: show UI using built in function, not relying on cfp package
//		figma.showUI(__html__, {
//			...windowSize,
//			themeColors: true
//		});
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
