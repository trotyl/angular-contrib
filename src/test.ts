// This file is required by karma.conf.js and loads recursively all the .spec and framework files
// tslint:disable

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  platformBrowserDynamicTesting,
  BrowserDynamicTestingModule,
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
// Then we find all the tests.
const context = require.context('./packages', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
