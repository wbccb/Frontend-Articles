/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class JoinRequestPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		const source = this.source;
		resolver
			.getHook(this.source)
			.tapAsync("JoinRequestPlugin", (request, resolveContext, callback) => {
				const obj = {
					...request,
					path: resolver.join(request.path, request.request),
					relativePath:
						request.relativePath &&
						resolver.join(request.relativePath, request.request),
					request: undefined
				};
				console.warn("==========================")
				console.warn("JoinRequestPlugin 上一个调用是", source);
				console.warn("JoinRequestPlugin 上一个调用是", target.name);
				console.warn("==========================")
				resolver.doResolve(target, obj, null, resolveContext, callback);
			});
	}
};
