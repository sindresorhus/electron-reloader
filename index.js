'use strict';
const path = require('path');
const electron = require('electron');
const chokidar = require('chokidar');
const isDev = require('electron-is-dev');

function getMainProcessPaths(topModuleObj) {
	const cwd = path.dirname(topModuleObj.filename);
	const paths = new Set([topModuleObj.filename]);

	const getPaths = moduleObj => {
		for (const child of moduleObj.children) {
			if (path.relative(cwd, child.filename).includes('node_modules')) {
				continue;
			}

			paths.add(child.filename);
			getPaths(child);
		}
	};

	getPaths(topModuleObj);

	return paths;
}

module.exports = (moduleObj, options) => {
	// This module should be a dev dependency, but guard
	// this in case the user included it as a dependency
	if (!isDev) {
		return;
	}

	if (!moduleObj) {
		throw new Error('You have to pass the `module` object');
	}

	options = Object.assign({
		watchRenderer: true
	}, options);

	const cwd = path.dirname(moduleObj.filename);
	const mainProcessPaths = getMainProcessPaths(moduleObj);
	const watchPaths = options.watchRenderer ? cwd : [...mainProcessPaths];

	const watcher = chokidar.watch(watchPaths, {
		cwd,
		disableGlobbing: true,
		ignored: [
			/(^|[/\\])\../, // Dotfiles
			'node_modules',
			'**/*.map'
		].concat(options.ignore)
	});

	if (options.debug) {
		watcher.on('ready', () => {
			console.log('Watched paths:', watcher.getWatched());
		});
	}

	watcher.on('change', filePath => {
		if (options.debug) {
			console.log('File changed:', filePath);
		}

		if (mainProcessPaths.has(path.join(cwd, filePath))) {
			electron.app.relaunch();
			electron.app.exit(0);
		} else {
			for (const win of electron.BrowserWindow.getAllWindows()) {
				win.webContents.reloadIgnoringCache();
			}
		}
	});
};
