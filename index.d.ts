/// <reference types="node"/>

declare namespace electronReloader {
	interface Options {
		/**
		Watch files used in the renderer process and reload the window when they change.

		@default true
		*/
		readonly watchRenderer?: boolean;

		/**
		Prints watched paths and when files change. Can be useful to make sure you set it up correctly.

		@default false
		*/
		readonly debug?: boolean;

		/**
		Ignore patterns passed to [`chokidar`](https://github.com/paulmillr/chokidar#path-filtering).

		By default, files/directories starting with a `.`, `.map` files, and `node_modules` directories are ignored. This option is additive to those.
		*/
		readonly ignore?: readonly (string | RegExp)[];
	}
}

/**
@param moduleObject - Global `module` object.

@example
```
import electronReloader = require('electron-reloader');

try {
	require('electron-reloader')(module);
} catch {}
```
*/
declare function electronReloader(
	moduleObject: NodeModule,
	options?: electronReloader.Options
): void;

export = electronReloader;
