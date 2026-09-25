import {expectError, expectType} from 'tsd';
import electronReloader from './index.js';

declare const nodeModule: NodeJS.Module;
declare const pattern: RegExp;

expectType<void>(electronReloader(import.meta));
expectType<void>(electronReloader(import.meta, {watchRenderer: true}));
expectType<void>(electronReloader(import.meta, {debug: true, ignore: ['tmp', pattern]}));
expectType<void>(electronReloader(import.meta, {watchRenderer: false, ignore: [pattern]}));
expectError(electronReloader(nodeModule));
expectError(electronReloader(import.meta, {ignored: []}));
