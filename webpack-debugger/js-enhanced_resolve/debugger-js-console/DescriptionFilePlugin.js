/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const DescriptionFileUtils = require("./DescriptionFileUtils");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class DescriptionFilePlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string[]} filenames filenames
	 * @param {boolean} pathIsFile pathIsFile
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, filenames, pathIsFile, target) {
		this.source = source;
		this.filenames = filenames;
		this.pathIsFile = pathIsFile;
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
			.tapAsync(
				"DescriptionFilePlugin",
				(request, resolveContext, callback) => {
					const path = request.path;
					if (!path) return callback();
					const directory = this.pathIsFile
						? DescriptionFileUtils.cdUp(path)
						: path;
					if (!directory) return callback();
					DescriptionFileUtils.loadDescriptionFile(
						resolver,
						directory,
						this.filenames,
						request.descriptionFilePath
							? {
									path: request.descriptionFilePath,
									content: request.descriptionFileData,
									directory: /** @type {string} */ (request.descriptionFileRoot)
							  }
							: undefined,
						resolveContext,
						(err, result) => {
							if (err) return callback(err);
							if (!result) {
								if (resolveContext.log)
									resolveContext.log(
										`No description file found in ${directory} or above`
									);
								return callback();
							}
							const relativePath =
								"." + path.substr(result.directory.length).replace(/\\/g, "/");
							const obj = {
								...request,
								descriptionFilePath: result.path,
								descriptionFileData: result.content,
								descriptionFileRoot: result.directory,
								relativePath: relativePath
							};
							console.error("==========================")
							console.error("DescriptionFilePlugin 上一个调用是", source);
							console.error("DescriptionFilePlugin 上一个调用是", target.name);
							console.error("==========================")

							resolver.doResolve(
								target,
								obj,
								"using description file: " +
									result.path +
									" (relative path: " +
									relativePath +
									")",
								resolveContext,
								(err, result) => {
									if (err) return callback(err);

									// Don't allow other processing
									if (result === undefined) return callback(null, null);
									callback(null, result);
								}
							);
						}
					);
				}
			);
	}
};
