'use strict';
const {inspect} = require('util');
const path = require('path');
const electron = require('electron');
const chokidar = require('chokidar');
const isDev = require('electron-is-dev');
const dateTime = require('date-time');
const chalk = require('chalk');
const findUp = require('find-up');

function getMainProcessPaths(topModuleObject, cwd) {
	const paths = new Set([topModuleObject.filename]);

	const getPaths = moduleObject => {
		for (const child of moduleObject.children) {
			if (paths.has(child.filename)) {
				continue;
			}

			if (path.relative(cwd, child.filename).includes('node_modules')) {
				continue;
			}

			paths.add(child.filename);
			getPaths(child);
		}
	};

	getPaths(topModuleObject);

	return paths;
}

module.exports = (moduleObject, options = {}) => {
	// This module should be a dev dependency, but guard
	// this in case the user included it as a dependency.
	if (!isDev) {
		return;
	}

	if (!moduleObject) {
		throw new Error('You have to pass the `module` object');
	}

	if (options.ignored) {
		throw new Error('The option is named `ignore` not `ignored`');
	}

	options = {
		watchRenderer: true,
		...options
	};

	const mainProcessDirectory = path.dirname(moduleObject.filename);
	const packageDirectory = findUp.sync('package.json', {cwd: mainProcessDirectory});
	const cwd = packageDirectory ? path.dirname(packageDirectory) : mainProcessDirectory;
	const mainProcessPaths = getMainProcessPaths(moduleObject, cwd);
	const watchPaths = options.watchRenderer ? cwd : [...mainProcessPaths];
	let isRelaunching = false;

	const watcher = chokidar.watch(watchPaths, {
		cwd,
		disableGlobbing: true,
		ignored: [
			/(^|[/\\])\../, // Dotfiles
			'node_modules',
			'**/*.map'
		].concat(options.ignore)
	});

	electron.app.on('quit', () => {
		watcher.close();
	});

	if (options.debug) {
		watcher.on('ready', () => {
			console.log('Watched paths:', inspect(watcher.getWatched(), {compact: false, colors: true}));
		});
	}

	watcher.on('change', filePath => {
		if (options.debug) {
			console.log('File changed:', chalk.bold(filePath), chalk.dim(`(${dateTime().split(' ')[1]})`));
		}

		if (mainProcessPaths.has(path.join(cwd, filePath))) {
			// Prevent multiple instances of Electron from being started due to the change
			// handler being called multiple times before the original instance exits.
			if (!isRelaunching) {
				electron.app.relaunch();
				electron.app.exit(0);
			}

			isRelaunching = true;
		} else {
			for (const window_ of electron.BrowserWindow.getAllWindows()) {
				window_.webContents.reloadIgnoringCache();

				for (const view_ of window_.getBrowserViews()) {
					view_.webContents.reloadIgnoringCache();
				}
			}
		}
	});
};
