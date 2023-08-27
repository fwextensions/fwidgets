const noop = () => void (0);

export class DeferredPromise<T> implements Promise<T> {
	private _promise: Promise<T>;

	readonly [Symbol.toStringTag]: string = "Promise";

	resolve: (value: (PromiseLike<T> | T)) => void = noop;
	reject: (reason?: any) => void = noop;

	constructor()
	{
		this._promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	then<TResult1 = T, TResult2 = never>(
		onFulfilled: (value: T) => (PromiseLike<TResult1> | TResult1),
		onRejected: (reason: any) => (PromiseLike<TResult2> | TResult2))
	{
		return this._promise.then(onFulfilled, onRejected);
	}

	catch<TResult2 = never>(
		onRejected: (reason: any) => (PromiseLike<TResult2> | TResult2))
	{
		return this._promise.catch(onRejected);
	}

	finally(
		onFinally?: (() => void) | undefined | null)
	{
		return this._promise.finally(onFinally);
	}
}
