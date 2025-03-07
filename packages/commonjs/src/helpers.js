export const isWrappedId = (id, suffix) => id.endsWith(suffix);
export const wrapId = (id, suffix) => `\0${id}${suffix}`;
export const unwrapId = (wrappedId, suffix) => wrappedId.slice(1, -suffix.length);

export const PROXY_SUFFIX = '?commonjs-proxy';
export const WRAPPED_SUFFIX = '?commonjs-wrapped';
export const EXTERNAL_SUFFIX = '?commonjs-external';
export const EXPORTS_SUFFIX = '?commonjs-exports';
export const MODULE_SUFFIX = '?commonjs-module';
export const ENTRY_SUFFIX = '?commonjs-entry';
export const ES_IMPORT_SUFFIX = '?commonjs-es-import';

export const DYNAMIC_MODULES_ID = '\0commonjs-dynamic-modules';
export const HELPERS_ID = '\0commonjsHelpers.js';

export const IS_WRAPPED_COMMONJS = 'withRequireFunction';

// `x['default']` is used instead of `x.default` for backward compatibility with ES3 browsers.
// Minifiers like uglify will usually transpile it back if compatibility with ES3 is not enabled.
// This could be improved by inspecting Rollup's "generatedCode" option

const HELPERS = `
export var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

export function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

export function getDefaultExportFromNamespaceIfPresent (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
}

export function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

export function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var f = n.default;
	var isMixed = Object.keys(n).some(function (k) { return k !== 'default' });
	function assignEnumerableProperties(obj, newObj) {
	  return function (k) {
		// Cannot redefine property: prototype
		if (k === 'prototype') return;
		var d = Object.getOwnPropertyDescriptor(obj, k);
		Object.defineProperty(
		  newObj,
		  k,
		  d.get
			? d
			: {
				enumerable: true,
				get: function () {
				  return obj[k];
				},
				// Fix Uncaught TypeError: Cannot set property updateOffset of function a()
				// Use case: https://github.com/moment/moment-timezone/blob/0.5.41/moment-timezone.js#L605
				set: function (value) {
				  obj[k] = value;
				},
			  }
		);
	  };
	}
	var a = {};
	Object.defineProperty(a, '__esModule', { value: true });
	if (typeof f == 'function') {
		a = function a() {
			if (this instanceof a) {
				var args = [null];
				args.push.apply(args, arguments);
				var Ctor = Function.bind.apply(f, args);
				return new Ctor();
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
		Object.getOwnPropertyNames(f).forEach(assignEnumerableProperties(f, a));
		if (!isMixed) {
			return a;
		}
	};
	Object.keys(n).forEach(assignEnumerableProperties(n, a));
	return a;
}
`;

export function getHelpersModule() {
  return HELPERS;
}
