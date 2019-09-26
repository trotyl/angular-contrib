[![CircleCI](https://img.shields.io/circleci/project/github/trotyl/angular-contrib.svg)](https://circleci.com/gh/trotyl/angular-contrib)
[![Codecov](https://img.shields.io/codecov/c/github/trotyl/angular-contrib.svg)](https://codecov.io/gh/trotyl/angular-contrib)


# Angular Contrib

Angular extensions powered by community.

## Packages

+ `@angular-contrib/core`
  + [Change Detection Scheduler][ChangeDetectionScheduler]
  + [IterableDiffers Extensibility][IterableDiffersExtensibility]
  + [KeyValueDiffers Extensibility][KeyValueDiffersExtensibility]
  + [`FastIterableDiffer`][FastIterableDiffer]
+ `@angular-contrib/common`
  + [`<ng-host>`][NgHost]
  + [`ngForIn`][NgForIn]
  + [`ngInit`][NgInit]
  + [`ngNoCheck`][NgNoCheck]
  + [`ngSwitchContinue`][NgSwitchContinue]

## Usage

Example of using `<ng-host>` directive.

Installing package:

```bash
npm install @angular-contrib/common
```

Importing NgModule:

```typescript
import { ContribNgHostModule } from '@angular-contrib/common';

@NgModule({
  imports: [ ContribNgHostModule ]
})
class AppModule { }
```

Using features:

```typescript
@Component({
  template: `
    <ng-host [ngClass]="{foo: true, bar: false}"></ng-host>
    <p>Hello World!</p>
  `
})
class AppComponent { }
```

## Goals

+ Fundamental functionalities only;
+ Lib only (no private API usage);
+ Angular feature requests only;

## Note

+ Please do not raise feature request here, instead making that to Angular itself. All features are picked there;
+ All features must be imported individuals due to possible future conflicts;
+ Any feature once implemented by Angular will be deprecated here;


[ChangeDetectionScheduler]: https://github.com/trotyl/angular-contrib/tree/master/projects/core/src/change-detection-scheduler
[FastIterableDiffer]: https://github.com/trotyl/angular-contrib/tree/master/projects/core/src/fast-iterable-differ
[IterableDiffersExtensibility]: https://github.com/trotyl/angular-contrib/tree/master/projects/core/src/iterable-differs
[KeyValueDiffersExtensibility]: https://github.com/trotyl/angular-contrib/tree/master/projects/core/src/key-value-differs
[NgForIn]: https://github.com/trotyl/angular-contrib/tree/master/projects/common/src/ng-for-in
[NgHost]: https://github.com/trotyl/angular-contrib/tree/master/projects/common/src/ng-host
[NgInit]: https://github.com/trotyl/angular-contrib/tree/master/projects/common/src/ng-init
[NgNoCheck]: https://github.com/trotyl/angular-contrib/tree/master/projects/common/src/ng-no-check
[NgSwitchContinue]: https://github.com/trotyl/angular-contrib/tree/master/projects/common/src/ng-switch-continue
