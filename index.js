import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspect} from 'node:util';
import {app} from 'electron';
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

	// An ES module has no module graph, so there is no way to know which files belong to the main process. Any file change restarts the app.
	const mainProcessFile = fileURLToPath(importMeta.url);
	const mainProcessDirectory = path.dirname(mainProcessFile);
	const packageDirectory = findUpSync('package.json', {cwd: mainProcessDirectory});
	const cwd = packageDirectory ? path.dirname(packageDirectory) : mainProcessDirectory;
	const watchPaths = watchRenderer ? cwd : mainProcessFile;
	let isRelaunching = false;

	const watcher = chokidar.watch(watchPaths, {
		cwd,
		ignored: [
			/(?:^|[\/\\])\../v, // Dotfiles
			/(?:^|[\/\\])node_modules(?:[\/\\]|$)/v,
			/\.map$/v,
			...(ignore ?? []),
		],
	});

	app.on('quit', () => {
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

		isRelaunching = true;
		app.relaunch();
		app.exit(0);
	});
}
