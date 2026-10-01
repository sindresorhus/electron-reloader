export type Options = {
	/**
	Paths, regular expressions, or functions to ignore, passed to [`chokidar`](https://github.com/paulmillr/chokidar#path-filtering). Globs are not supported, and a path must match exactly. Paths are relative to the package directory. Regular expressions are tested against the absolute path, with forward slashes also on Windows, so do not anchor them with `^`. To ignore a directory, use a path like `'src'`, and use a regular expression for patterns like `/\.test\.js$/`. A function receives the absolute path, with forward slashes. Return `true` to ignore the path.

	By default, files/directories starting with a `.`, `.map` files, and `node_modules` directories are ignored. This option is additive to those.
	*/
	readonly ignore?: ReadonlyArray<string | RegExp | ((path: string) => boolean)>;

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
