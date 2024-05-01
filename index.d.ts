export type Options = {
	/**
	Paths or regular expressions to ignore, passed to [`chokidar`](https://github.com/paulmillr/chokidar#path-filtering). Globs are not supported, and a path must match exactly. Paths are relative to the package directory.

	By default, files/directories starting with a `.`, `.map` files, and `node_modules` directories are ignored. This option is additive to those.
	*/
	readonly ignore?: ReadonlyArray<string | RegExp>;

	/**
	Watch files used in the renderer process and restart the app when they change.

	@default true
	*/
	readonly watchRenderer?: boolean;

	/**
	Prints watched paths and when files change. Can be useful to make sure you set it up correctly.

	@default false
	*/
	readonly debug?: boolean;
};

/**
Restart the app when a file changes.

An ES module has no module graph, so main process files cannot be distinguished from renderer files. Any watched file change restarts the app.

@param importMeta - The `import.meta` object of the main process entry file.

@example
```
try {
	const {default: reload} = await import('electron-reloader');

	reload(import.meta);
} catch {}
```
*/
export default function electronReloader(importMeta: ImportMeta, options?: Options): void;
