import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Container, Stack, VerticalSpace } from "@create-figma-plugin/ui";
import { receive, DeferredPromise } from "figma-await-call";
import { FwidgetsEvent } from "@/constants";
import InputText from "@/components/InputText";
import InputButtons from "@/components/InputButtons";
import InputDropdown from "@/components/InputDropdown";

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

	if (["text", "buttons", "dropdown"].includes(type)) {
		return {
			type,
			options,
			deferred: new DeferredPromise()
		};
	}

	throw new Error(`Unrecognized widget type: ${type}.`);
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

		switch (type) {
			case "text":
				return (
					<InputText
						key={i}
						confirm={handleConfirm}
						focused={focused}
						{...options}
					/>
				);

			case "buttons":
				return (
					<InputButtons
						key={i}
						confirm={handleConfirm}
						focused={focused}
						{...options}
					/>
				);

			case "dropdown":
				return (
					<InputDropdown
						key={i}
						confirm={handleConfirm}
						focused={focused}
						{...options}
					/>
				);
		}
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
