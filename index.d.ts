export type Options = {
	/**
	Paths, regular expressions, or functions to ignore, passed to [`chokidar`](https://github.com/paulmillr/chokidar#path-filtering). Globs are not supported, and a path must match exactly. Paths are relative to the package directory. Regular expressions are tested against the absolute path, with forward slashes also on Windows, so do not anchor them with `^`. To ignore a directory, use a path like `'src'`, and use a regular expression for patterns like `/\.test\.js$/`. A function receives the absolute path, with forward slashes. Return `true` to ignore the path.

	By default, files/directories starting with a `.`, `.map` files, and `node_modules` directories are ignored. This option is additive to those.
	*/
	readonly ignore?: ReadonlyArray<string | RegExp | ((path: string) => boolean)>;

	/**
	Reload the windows when a file that is not a main process file changes.

	Setting this to `false` can be useful if you use a different reload strategy in the renderer process, like [`HMR`](https://webpack.js.org/concepts/hot-module-replacement/).

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
Restart the app when a main process file changes, and reload the windows when any other file changes.

A main process file is a JavaScript file the main process has loaded. Other files the main process uses, like JSON modules, files read with `fs`, and worker scripts, are not main process files, so a change to them does not restart the app.

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
