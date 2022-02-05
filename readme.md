# electron-reloader

> Simple auto-reloading for Electron apps during development

It *just works*. When files used in the main process are changed, the app is restarted, and when files used in the browser window are changed, the page is reloaded.

Note that it will not work correctly if you transpile the main process JS files of your app, but it doesn't make sense to do that anyway.

## Install

```sh
npm install --save-dev electron-reloader
```

*Requires Electron 5 or later.*

## Usage

The following must be included in the app entry file, usually named `index.js`:

```js
try {
	require('electron-reloader')(module);
} catch {}
```

You have to pass the `module` object so we can read the module graph and figure out which files belong to the main process.

The `try/catch` is needed so it doesn't throw `Cannot find module 'electron-reloader'` in production.

## API

### reloader(module, options?)

#### module

Type: `object`

The global `module` object.

#### options

Type: `object`

##### ignore

Type: `Array<string | RegExp>`

Ignore patterns passed to [`chokidar`](https://github.com/paulmillr/chokidar#path-filtering).

By default, files/directories starting with a `.`, `.map` files, and `node_modules` directories are ignored. This option is additive to those.

##### watchRenderer

Type: `boolean`\
Default: `true`

Watch files used in the renderer process and reload the window when they change.

Setting this to `false` can be useful if you use a different reload strategy in the rendererer process, like [`HMR`](https://webpack.js.org/concepts/hot-module-replacement/).

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
