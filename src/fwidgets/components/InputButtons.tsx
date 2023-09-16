import { h } from "preact";
import { useState } from "preact/hooks";
import {
	Button,
	Inline,
	Stack,
	useInitialFocus
} from "@create-figma-plugin/ui";
import classnames from "classnames/bind";
import Label from "@/components/Label";
import styles from "./InputButtons.css";

interface ButtonProps {
	label: string;
	value?: any;
}

interface InputButtonProps {
	confirm: (text: string) => void;
	buttons: string[];
//	buttons: (string|ButtonProps)[];
	disabled?: boolean;
	label?: string;
}

const cx = classnames.bind(styles);

export default function InputButtons({
		confirm,
		buttons,
		disabled = false,
		label = "",
	}: InputButtonProps)
{
	const [selectedLabel, setSelectedLabel] = useState("");
	const initialFocus = useInitialFocus();

	const handleClick = (label: string) => {
		setSelectedLabel(label);
		confirm(label);
	};

	const buttonElements = buttons.map((label, i) => (
		<Button class={cx("inputButton", { "selected": label === selectedLabel })}
			key={i}
			disabled={disabled}
			secondary
			{...(i === 0 ? initialFocus : {})}
			onClick={() => handleClick(label)}
		>
			{label}
		</Button>
	));

	return (
		<Stack space="small">
			<Label
				text={label}
				disabled={disabled}
			/>
			<Inline space="extraSmall">
				{buttonElements}
			</Inline>
		</Stack>
	);
}
