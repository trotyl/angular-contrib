# Auto Change Detection with NoopZone

Automatically trigger change detection without Zone.js.

## Type

**Patch**

## Provenance

+ https://github.com/angular/angular/issues/20204

## NgModule

`@angular-contrib/core#ContribChangeDetectionSchedulerModule`

## Usage

Using default scheduler (based on `Promise.then()`):

```typescript
import { ContribChangeDetectionSchedulerModule } from '@angular-contrib/core';

@NgModule({
  imports: [ ContribChangeDetectionSchedulerModule ],
})
class MyModule { }

platformBrowserDynamic.bootstrapModule(MyModule, { ngZone: 'noop' });
```

Providing custom scheduler:

```typescript
import { ChangeDetectionScheduler, ContribChangeDetectionSchedulerModule } from '@angular-contrib/core';

@Injectable()
class ImmediateTickScheduler implements ChangeDetectionScheduler {
  constructor(private appRef: ApplicationRef) { }

  schedule(): void {
    this.appRef.tick();
  }
}

@NgModule({
  imports: [ ContribChangeDetectionSchedulerModule ],
  providers: [
    { provide: ChangeDetectionScheduler, useClass: ImmediateTickScheduler },
  ],
})
class MyModule { }

platformBrowserDynamic.bootstrapModule(MyModule, { ngZone: 'noop' });
```

## Note

+ Depends on `markForCheck` integration like async pipe;
+ When multiple applications bootstrapped, would only schedule change detection for last ticked application due to technically limitation (except for `markForCheck` from root views);

## Requirements

+ WeakMap;
