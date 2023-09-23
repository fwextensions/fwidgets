import { ComponentChildren, h, JSX } from "preact";
import { Inline, Stack } from "@create-figma-plugin/ui";
import Label from "@/components/Label";
import NextButton from "@/components/NextButton";

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
			<Inline space="small">
				{children}
				<NextButton
					disabled={!nextEnabled}
					hidden={disabled}
					onClick={onNextClick}
				/>
			</Inline>
		</Stack>
	);
}
