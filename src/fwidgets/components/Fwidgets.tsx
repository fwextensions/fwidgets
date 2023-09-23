import { h } from "preact";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState
} from "preact/hooks";
import { Container, Stack, VerticalSpace } from "@create-figma-plugin/ui";
import { receive } from "figma-await-call";
import { FwidgetsCall } from "@/constants";
import { createWidgetSpec, createWidgetComponent, WidgetSpec } from "@/widgets";

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
	}, [widgets]);

	const handleConfirm = useCallback(
		(text: string) => widgets[widgets.length - 1]?.deferred.resolve(text),
		[widgets]
	);

	const widgetElements = widgets.map((spec, i) => {
		const focused = i === widgets.length - 1;

		return createWidgetComponent(spec, focused, handleConfirm);
	});

	return (
		<Container space="large">
			<VerticalSpace space="large" />
			<Stack space="small">
				{widgetElements}
				<VerticalSpace space="large" />
			</Stack>
		</Container>
	);
}
