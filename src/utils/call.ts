import { DeferredPromise } from "@/utils/DeferredPromise";

interface Message {
	type: "call"|"response";
	id: number;
	name: string;
	data: any[];
}

type ResponderFn = (...data: any) => any;

const promisesByID: Record<number, DeferredPromise<any>> = {};
const respondersByName: Record<string, ResponderFn> = {};
let currentID = 0;
let post: (message: Message) => void;

	// add the environment-specific ways of sending/receiving messages
if (typeof window === "undefined") {
	post = (message: Message) => figma.ui.postMessage(message);

	figma.ui.on("message", handleMessage);
} else {
	post = (message: Message) => window.parent.postMessage({ pluginMessage: message }, "*");

	addEventListener("message", (event) => {
		if (typeof event.data.pluginMessage !== "undefined") {
			handleMessage(event.data.pluginMessage);
		}
	});
}

async function handleMessage(
	message: Message)
{
	const { type, id, name, data } = message;

	if (type === "call") {
		const responder = respondersByName[name];

		if (responder) {
			const response = await responder(...data);

			post({ type: "response", id, name, data: response });
		}
	} else {
		const promise = promisesByID[id];

		if (promise) {
			promise.resolve(data);
		}
	}
}

export function call(
	name: string,
	...data: any[])
{
	const id = currentID++;
	const promise = new DeferredPromise();

	promisesByID[id] = promise;
	post({ type: "call", id, name, data });

	return promise;
}

export function respondTo(
	name: string,
	fn: ResponderFn)
{
	respondersByName[name] = fn;
}
