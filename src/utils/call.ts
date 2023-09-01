import { DeferredPromise } from "@/utils/DeferredPromise";

interface Message {
	type: "call"|"response";
	id: number;
	name: string;
	data: any;
}

type ReceiverFn = (...data: any) => any;

const promisesByID: Record<number, DeferredPromise<any>> = {};
const receiversByName: Record<string, ReceiverFn> = {};
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

async function handleCall(
	message: Message)
{
	const { id, name, data } = message;
	const receiver = receiversByName[name];
	let success = true;
	let response;

	try {
		response = await receiver(...data);
	} catch (error) {
			// the Figma postMessage() seems to just stringify everything, but that
			// turns an Error into {}.  so explicitly walk its own properties and
			// stringify that.
		response = JSON.stringify(error, Object.getOwnPropertyNames(error));
		success = false;
	}

	post({ type: "response", id, name, data: { success, response } });
}

async function handleResponse(
	message: Message)
{
	const { id, data: { success, response} } = message;
	const promise = promisesByID[id];

	if (success) {
		promise.resolve(response);
	} else {
			// since this is a failure, we know response is JSON, so parse it, turn it
			// back into an Error, and reject the promise with it
		const { message, ...rest } = JSON.parse(response);

			// passing a cause to the constructor is available in Chrome 93+
			//@ts-ignore
		const error = new Error(message, { cause: rest });

		promise.reject(error);
	}
}

function handleMessage(
	message: Message)
{
	if (!message || typeof message !== "object") {
		return;
	}

	const { type, id, name } = message;

	if (type === "call" && name in receiversByName) {
		return handleCall(message);
	} else if (type === "response" && id in promisesByID) {
		return handleResponse(message);
	}
}

/**
 * Makes a call between the main and UI threads.  It returns a promise that can
 * be awaited until the other side responds.
 *
 * @param {string} name - The name of the receiver in the other thread that is
 * expected to respond this call.
 * @param {...any} data - Zero or more parameters to send to the receiver.  They
 * must be of types that can be passed through `postMessage()`.
 * @return Promise<T> - A promise that will be resolved with the receiver's
 * response when it is sent.
 */
export function call<T>(
	name: string,
	...data: any[])
{
	const id = currentID++;
	const promise = new DeferredPromise<T>();

	promisesByID[id] = promise;
	post({ type: "call", id, name, data });

	return promise;
}

/**
 * Assigns a function to receive calls with a particular name.  It will receive
 * whatever parameters are passed to the `call()` function.  Its return value
 * will be sent back to the caller.
 *
 * If the receiver returns a `Promise`, then no response will be sent to the
 * caller until the promise resolves.
 *
 * Only a single function can listen for any given name, so subsequent calls to
 * `receive()` will replace previous functions.
 *
 * @param {string} name - The name of the receiver.
 * @param {ReceiverFn} fn - The function that will receive calls to the `name`
 * parameter.
 */
export function receive(
	name: string,
	fn: ReceiverFn)
{
	receiversByName[name] = fn;
}

/**
 * Removes the receiver for a given call name.  Subsequent calls to that name
 * from the other thread will never return.
 *
 * @param {string} name - The name of the receiver to remove.
 */
export function ignore(
	name: string)
{
	delete receiversByName[name];
}
