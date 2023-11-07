import { h } from "preact";
import JSX = h.JSX;
import { useCallback, useState } from "preact/hooks";
import {
	Button,
	Inline,
	Stack,
	useInitialFocus
} from "@create-figma-plugin/ui";
import classnames from "classnames/bind";
import { keepName } from "../utils";
import Label from "./Label";
import styles from "./InputButtons.module.css";

interface ButtonProps {
	label: string;
	value?: unknown;
}

interface InputButtonProps {
	confirm: (text: string | null) => void;
	buttons: string[];
//	buttons: (string | ButtonProps)[];
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

	const handleClick = useCallback(
		(label: string) => {
			setSelectedLabel(label);
			confirm(label);
		},
		[]
	);

	const handleKeyDown = useCallback(
		(event: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Escape") {
				confirm(null);
			}
		},
		[]
	);

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
			<Inline space="extraSmall"
				onKeyDown={!disabled ? handleKeyDown : undefined}
			>
				{buttonElements}
			</Inline>
		</Stack>
	);
}

keepName(InputButtons, "InputButtons");
