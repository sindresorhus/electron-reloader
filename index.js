import {spawn} from 'node:child_process';
import fs from 'node:fs';
import {Session} from 'node:inspector';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import {inspect} from 'node:util';
import {app, webContents} from 'electron';
import chalk from 'chalk';
import chokidar from 'chokidar';
import dateTime from 'date-time';
import isDev from 'electron-is-dev';
import {findUpSync} from 'find-up';

export default function electronReloader(importMeta, {watchRenderer = true, ignore, debug, ignored} = {}) {
	// This module should be a dev dependency, but guard
	// this in case the user included it as a dependency.
	if (!isDev) {
		return;
	}

	if (!importMeta?.url) {
		throw new Error('You have to pass `import.meta`');
	}

	if (ignored) {
		throw new Error('The option is named `ignore` not `ignored`');
	}

	const mainProcessDirectory = path.dirname(fileURLToPath(importMeta.url));
	const packageDirectory = findUpSync('package.json', {cwd: mainProcessDirectory});
	const cwd = packageDirectory ? path.dirname(packageDirectory) : mainProcessDirectory;
	const mainProcessFiles = new Set();
	let isRelaunching = false;

	// The watcher reports paths through symlinks, while V8 reports them with symlinks resolved but with the letter case of the import, so both are compared as real paths.
	const realPath = filePath => {
		try {
			return fs.realpathSync.native(filePath);
		} catch {
			return filePath;
		}
	};

	// An ES module has no public module graph, so the inspector is used to know which files belong to the main process. When the debugger is enabled, V8 reports the scripts that are already loaded, and then each new one.
	const session = new Session();
	session.connect();
	session.on('Debugger.scriptParsed', ({params: {url}}) => {
		if (url.startsWith('file:')) {
			mainProcessFiles.add(realPath(fileURLToPath(url)));
		}
	});
	session.post('Debugger.enable');

	const defaultIgnored = [
		/(?:^|[\/\\])\../v, // Dotfiles
		/(?:^|[\/\\])node_modules(?:[\/\\]|$)/v,
		/\.map$/v,
	];

	const watcher = chokidar.watch(cwd, {
		cwd,
		ignored: [
			// Tested against the path relative to the package directory, so a package inside a dot-directory or `node_modules` is still watched.
			filePath => {
				const relativePath = path.relative(cwd, filePath);
				return defaultIgnored.some(regex => regex.test(relativePath));
			},
			...(ignore ?? []),
		],
		ignorePermissionErrors: true,
	});

	// Without a listener, a watcher error, like too many open files, would crash the app.
	watcher.on('error', error => {
		console.error('electron-reloader:', error);
	});

	app.on('quit', () => {
		session.disconnect();
		watcher.close();
	});

	if (debug) {
		watcher.on('ready', () => {
			console.log('Watched paths:', inspect(watcher.getWatched(), {compact: false, colors: true}));
		});
	}

	watcher.on('change', filePath => {
		if (debug) {
			console.log('File changed:', chalk.bold(filePath), chalk.dim(`(${dateTime().split(' ', 2)[1]})`));
		}

		// Prevent multiple instances of Electron from being started due to the change
		// handler being called multiple times before the original instance exits.
		if (isRelaunching) {
			return;
		}

		if (!mainProcessFiles.has(realPath(path.join(cwd, filePath)))) {
			if (!watchRenderer) {
				return;
			}

			for (const contents of webContents.getAllWebContents()) {
				// DevTools has the type `remote`. A `<webview>` page reloads with the page that contains it.
				if (!['remote', 'webview'].includes(contents.getType())) {
					contents.reloadIgnoringCache();
				}
			}

			return;
		}

		isRelaunching = true;

		// We do not use `app.relaunch()` as it sends the output of the new instance to `/dev/null`. The single instance lock is released first so the new instance can get it while this one exits.
		app.releaseSingleInstanceLock();
		spawn(process.execPath, process.argv.slice(1), {
			detached: true, // Keeps the new instance alive on Windows when this one exits.
			stdio: 'inherit',
		}).unref();
		app.exit(0);
	});
}
