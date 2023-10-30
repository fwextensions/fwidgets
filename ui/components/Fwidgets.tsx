import { h } from "preact";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState
} from "preact/hooks";
import { Container, Stack, VerticalSpace } from "@create-figma-plugin/ui";
import { receive } from "figma-await-call";
import { FwidgetsCall } from "../../shared/constants";
import { createWidgetSpec, createWidgetElement, WidgetSpec } from "../widgets";

function disable(
	widgets: WidgetSpec[])
{
	widgets.forEach(({ options }) => options && (options.disabled = true));

	return widgets;
}

export default function Fwidgets()
{
	const [widgets, setWidgets] = useState<WidgetSpec[]>([]);

	useEffect(() => {
		receive(FwidgetsCall, (data) => {
			const response = createWidgetSpec(data);

			setWidgets((widgets) => [...disable(widgets), response]);

			return response.deferred;
		});
	}, []);

		// using useEffect here scrolls to the previous scrollHeight, even though
		// useLayoutEffect is supposed to happen before rendering.  and setting
		// document.body.scrollTop doesn't seem to work, so scroll the whole window.
	useLayoutEffect(() => {
		window.scrollTo({
			top: document.body.scrollHeight,
			left: 0,
			behavior: "smooth"
		});

			// the previous scroll call isn't always sufficient to scroll the window to
			// the bottom, so do it again after a slight delay
			// TODO: fix this kludge
		setTimeout(() => window.scrollTo({
			top: document.body.scrollHeight,
			left: 0,
		}), 10);
	}, [widgets]);

	const handleConfirm = useCallback(
		(text: string) => widgets[widgets.length - 1]?.deferred.resolve(text),
		[widgets]
	);

	const widgetElements = widgets.map((spec, i) => {
		const focused = i === widgets.length - 1;

		return createWidgetElement(spec, focused, handleConfirm);
	});

	return (
		<Container space="large">
			<VerticalSpace space="large" />
			<Stack space="small">
				{widgetElements}
			</Stack>
			<VerticalSpace space="large" />
		</Container>
	);
}
