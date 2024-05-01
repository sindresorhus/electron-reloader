# electron-reloader

> Simple auto-reloading for Electron apps during development

It *just works*. When a file changes, the app is restarted.

Note that it will not work correctly if you transpile the main process JS files of your app, but it doesn't make sense to do that anyway.

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

## API

### reload(importMeta, options?)

#### importMeta

Type: `object`

The [`import.meta`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) object of the main process entry file.

#### options

Type: `object`

##### ignore

Type: `Array<string | RegExp>`

Paths or regular expressions to ignore, passed to [`chokidar`](https://github.com/paulmillr/chokidar#path-filtering). Globs are not supported, and a path must match exactly. Paths are relative to the package directory.

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

## Tip

### Using it with Webpack watch mode

Just add the source directory to the `ignore` option. The dist directory is already watched, so when a source file changes, webpack will build it and output it to the dist directory, which this module will detect.

## Related

- [electron-util](https://github.com/sindresorhus/electron-util) - Useful utilities for developing Electron apps and modules
- [electron-debug](https://github.com/sindresorhus/electron-debug) - Adds useful debug features to your Electron app
- [electron-context-menu](https://github.com/sindresorhus/electron-context-menu) - Context menu for your Electron app
- [electron-dl](https://github.com/sindresorhus/electron-dl) - Simplified file downloads for your Electron app
- [electron-unhandled](https://github.com/sindresorhus/electron-unhandled) - Catch unhandled errors and promise rejections in your Electron app
- [electron-serve](https://github.com/sindresorhus/electron-serve) - Static file serving for Electron apps
