# electron-reloader

> Simple auto-reloading for Electron apps during development

It *just works*. When a file changes, the app is restarted.

## Install

```sh
npm install --save-dev electron-reloader
```

*Requires an ESM main process and Electron 44 or later.*

## Usage

The following must be included in the app entry file, usually named `index.js`:

```js
try {
	const {default: reload} = await import('electron-reloader');

	reload(import.meta);
} catch {}
```

You have to pass `import.meta` so we can find the directory to watch.

Since an [ES module](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) has no module graph, main process files cannot be distinguished from renderer files, so any watched file change restarts the app.

The `try/catch` is needed so it doesn't throw `Cannot find module 'electron-reloader'` in production.

> [!NOTE]
> The restarted app is a new process. Its output still goes to the terminal, but the `electron` command exits on the first restart, so the terminal prompt comes back and <kbd>Ctrl</kbd>+<kbd>C</kbd> does not quit the app. Quit the app normally instead.

## API

### reload(importMeta, options?)

#### importMeta

Type: `object`

The [`import.meta`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) object of the main process entry file.

#### options

Type: `object`

##### ignore

Type: `Array<string | RegExp | ((path: string) => boolean)>`

Paths, regular expressions, or functions to ignore, passed to [`chokidar`](https://github.com/paulmillr/chokidar#path-filtering). Globs are not supported, and a path must match exactly. Paths are relative to the package directory. Regular expressions are tested against the absolute path, with forward slashes also on Windows, so do not anchor them with `^`. To ignore a directory, use a path like `'src'`, and use a regular expression for patterns like `/\.test\.js$/`. A function receives the absolute path, with forward slashes. Return `true` to ignore the path.

By default, files/directories starting with a `.`, `.map` files, and `node_modules` directories are ignored. This option is additive to those.

##### watchRenderer

Type: `boolean`\
Default: `true`

Watch files used in the renderer process and restart the app when they change.

Setting this to `false` can be useful if you use a different reload strategy in the renderer process, like [`HMR`](https://webpack.js.org/concepts/hot-module-replacement/).

##### debug

Type: `boolean`\
Default: `false`

Prints watched paths and when files change.

Can be useful to make sure you set it up correctly.

## Tips

### Using it with TypeScript

Compile the main process to ESM (for example, `"module": "nodenext"` in `tsconfig.json` with `"type": "module"` in `package.json`), and put the `reload(import.meta)` call in the source of the entry file. Then add the source directory to the `ignore` option, so the app only restarts when the compiled output changes.

### Using it with Webpack watch mode

Just add the source directory to the `ignore` option. The dist directory is already watched, so when a source file changes, webpack will build it and output it to the dist directory, which this module will detect.

## Related

- [electron-util](https://github.com/sindresorhus/electron-util) - Useful utilities for developing Electron apps and modules
- [electron-debug](https://github.com/sindresorhus/electron-debug) - Adds useful debug features to your Electron app
- [electron-context-menu](https://github.com/sindresorhus/electron-context-menu) - Context menu for your Electron app
- [electron-dl](https://github.com/sindresorhus/electron-dl) - Simplified file downloads for your Electron app
- [electron-unhandled](https://github.com/sindresorhus/electron-unhandled) - Catch unhandled errors and promise rejections in your Electron app
- [electron-serve](https://github.com/sindresorhus/electron-serve) - Static file serving for Electron apps
