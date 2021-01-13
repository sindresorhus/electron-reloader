/// <reference types="node"/>

/**
 * Setup `electron-reloader`.
 *
 * @param moduleObject - Global `module` object.
 * @param options.watchRenderer - Watch files used in the renderer process and reload the window when they change. Defaults to `true`.
 * @param options.debug - Prints watched paths and when files change. Can be useful to make sure you set it up correctly.
 * @param options.ignore - Ignore patterns passed to [`chokidar`](https://github.com/paulmillr/chokidar#path-filtering). By default, files/directories starting with a `.`, `.map` files, and `node_modules` directories are ignored. This option is additive to those.
 *
 * @example
 * ```
 * const setupElectronReloader = require('electron-reloader');
 *
 * try {
 * 	setupElectronReloader(module, { ignore: [ 'client/src' ] });
 * } catch (error) {
 * 	console.error('Unable to setup reloading', error);
 * }
 * ```
 */
declare function setupElectronReloader(
	moduleObject: NodeModule,
	options?: {
		watchRenderer?: boolean,
		debug?: boolean,
		ignore?: ReadonlyArray<string | RegExp>
	}
): void;

export = setupElectronReloader;