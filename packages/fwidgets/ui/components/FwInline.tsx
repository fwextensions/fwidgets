import { ComponentChildren, h } from "preact";
import { Space } from "@create-figma-plugin/ui";
import classnames from "classnames/bind";
import styles from "./FwInline.module.css";

export type FwInlineProps = {
	children: ComponentChildren;
	space?: InlineSpace;
}
export type InlineSpace = Space;

const cx = classnames.bind(styles);

export default function FwInline({
		space = "medium",
		children,
		...rest
	}: FwInlineProps)
{
	return (
		<div
			{...rest}
			class={cx("fwInline", space)}
		>
			{children}
		</div>
	);
}
