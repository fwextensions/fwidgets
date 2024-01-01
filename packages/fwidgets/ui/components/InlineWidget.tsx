import { ComponentChildren, h, JSX } from "preact";
import { Stack } from "@create-figma-plugin/ui";
import Label from "./Label";
import NextButton from "./NextButton";
import FwInline from "./FwInline";

interface InlineWidgetProps {
	label?: string,
	disabled?: boolean;
	nextEnabled?: boolean;
	onNextClick: JSX.MouseEventHandler<HTMLButtonElement>;
	children: ComponentChildren;
}

export default function InlineWidget({
		label = "",
		disabled = false,
		nextEnabled = true,
		onNextClick,
		children
	}: InlineWidgetProps)
{
	return (
		<Stack space="small">
			<Label
				text={label}
				disabled={disabled}
			/>
			<FwInline space="small">
				{children}
				<NextButton
					disabled={!nextEnabled}
					hidden={disabled}
					onClick={onNextClick}
				/>
			</FwInline>
		</Stack>
	);
}
