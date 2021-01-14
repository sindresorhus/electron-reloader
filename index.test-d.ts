import {expectType} from 'tsd';
import electronReloader = require('.');

expectType<void>(electronReloader(module));
expectType<void>(electronReloader(module, {watchRenderer: true}));
expectType<void>(electronReloader(module, {debug: true, ignore: ['tmp', /dist/]}));
expectType<void>(electronReloader(module, {watchRenderer: true, ignore: ['tmp', /dist/]}));
expectType<void>(electronReloader(module, {watchRenderer: true, debug: true, ignore: ['tmp', /dist/]}));
