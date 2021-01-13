import {expectType} from 'tsd';
import setupElectronReloader = require('.');

expectType<void>(setupElectronReloader(module));
expectType<void>(setupElectronReloader(module, { watchRenderer: true }));
expectType<void>(setupElectronReloader(module, { debug: true, ignore: [ 'tmp', /dist/ ] }));
expectType<void>(setupElectronReloader(module, { watchRenderer: true, ignore: [ 'tmp', /dist/ ] }));
expectType<void>(setupElectronReloader(module, { watchRenderer: true, debug: true, ignore: [ 'tmp', /dist/ ] }));
