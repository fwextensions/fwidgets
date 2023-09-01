import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Stack, VerticalSpace } from "@create-figma-plugin/ui";
import { receive } from "@/utils/call";
import { DeferredPromise } from "@/utils/DeferredPromise";
import { FwidgetsEvent } from "@/fwidgets/constants";
import InputText from "@/fwidgets/components/InputText";
import InputButtons from "@/fwidgets/components/InputButtons";

interface WidgetCall {
	type: string;
	options?: Record<string, any>;
}

interface WidgetSpec extends WidgetCall {
	deferred: DeferredPromise<any>;
}

const Elements = {

};

function createWidgetSpec(
	data: WidgetCall)
{
	if (!data || typeof data !== "object") {
		return new Error(`Unrecognized widget data: ${data}.`);
	}

	const { type, options } = data;

	if (["text", "buttons"].includes(type)) {
		return {
			type,
			options,
			deferred: new DeferredPromise()
		};
	}

	return new Error(`Unrecognized widget type: ${type}.`);
}

function disable(
	widgets: WidgetSpec[])
{
	widgets.forEach(({ options }) => options && (options.disabled = true));

	return widgets;
}

export default function Fwidgets()
{
	const [widgets, setWidgets] = useState<any[]>([]);

	useEffect(() => {
		receive(FwidgetsEvent, (data) => {
			const response = createWidgetSpec(data);

			if (!(response instanceof Error)) {
				setWidgets((widgets) => [...disable(widgets), response]);

				return response.deferred;
			}

			return response;
		});
	}, []);

	const handleConfirm = useCallback(
		(text: string) => widgets[widgets.length - 1]?.deferred.resolve(text),
		[widgets]
	);

	const widgetElements = widgets.map(({ type, options }, i) => {
		const focused = i === widgets.length - 1;

		if (type === "text") {
			return (
				<InputText
					key={i}
					confirm={handleConfirm}
					focused={focused}
					{...options}
				/>
			);
		} else {
			return (
				<InputButtons
					key={i}
					confirm={handleConfirm}
					focused={focused}
					{...options}
				/>
			);
		}
	});

	return (
		<Stack space="small">
			{widgetElements}
			<VerticalSpace space="large" />
		</Stack>
	);
}
