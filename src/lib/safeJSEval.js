/**
 * Source: Stackoverflow
 * @param {string} untrustedCode
 * @return {Promise<any>}
 */
export function safeJSEval(untrustedCode)
{
	return new Promise(function (resolve, reject)
	{
		var blobURL = URL.createObjectURL(new Blob([
				"(",
				function ()
				{
					var _postMessage = postMessage;
					var _addEventListener = addEventListener;
					// @ts-ignore
					(function (obj)
					{
						"use strict";

						var current = obj;
						var keepProperties =
							[
								// Required
								'Object', 'Function', 'Infinity', 'NaN', 'undefined', 'caches', 'TEMPORARY', 'PERSISTENT',
								// Optional, but trivial to get back
								'Array', 'Boolean', 'Number', 'String', 'Symbol',
								// Optional
								'Math',
							];

						do
						{
							Object.getOwnPropertyNames(current).forEach(function (name)
							{
								if (keepProperties.indexOf(name) === -1)
								{
									delete current[name];
								}
							});

							current = Object.getPrototypeOf(current);
						}
						while (current !== Object.prototype)
							;
						/** @ts-ignore */
					})(this);

					_addEventListener("message", function (e)
					{
						var f = new Function("", "return (" + e.data + "\n);");
						_postMessage(f());
					});
				}.toString(),
				")()"],
			{type: "application/javascript"}));

		var worker = new Worker(blobURL);

		URL.revokeObjectURL(blobURL);

		worker.onmessage = function (evt)
		{
			worker.terminate();
			resolve(evt.data);
		};

		worker.onerror = function (evt)
		{
			reject(new Error(evt.message));
		};

		worker.postMessage(untrustedCode);

		setTimeout(function ()
		{
			worker.terminate();
			reject(new Error('The worker timed out.'));
		}, 1000);
	});
}