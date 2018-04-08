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
  + [`ngSwitchCaseContinue`][NgSwitchContinue]

## Usage

Example of using `<ng-host>` directive.

Installing package:

```bash
npm install @angular-contrib/common
```

Importing NgModule:

```typescript
import { HostModule } from '@angular-contrib/common';

@NgModule({
  imports: [ HostModule ]
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


[ChangeDetectionScheduler]: https://github.com/trotyl/angular-contrib/tree/master/packages/core/change-detection-scheduler
[FastIterableDiffer]: https://github.com/trotyl/angular-contrib/tree/master/packages/core/fast-iterable-differ
[IterableDiffersExtensibility]: https://github.com/trotyl/angular-contrib/tree/master/packages/core/iterable-differs
[KeyValueDiffersExtensibility]: https://github.com/trotyl/angular-contrib/tree/master/packages/core/key-value-differs
[NgForIn]: https://github.com/trotyl/angular-contrib/tree/master/packages/common/for-in
[NgInit]: https://github.com/trotyl/angular-contrib/tree/master/packages/common/init
[NgHost]: https://github.com/trotyl/angular-contrib/tree/master/packages/common/host
[NgNoCheck]: https://github.com/trotyl/angular-contrib/tree/master/packages/common/no-check
[NgSwitchContinue]: https://github.com/trotyl/angular-contrib/tree/master/packages/common/switch-continue
