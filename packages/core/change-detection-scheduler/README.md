# Auto Change Detection with NoopZone

Automatically trigger change detection without Zone.js.

## Type

**Enhancement**

## Provenance

+ https://github.com/angular/angular/issues/20204

## NgModule

`@angular-contrib/core#ChangeDetectionSchedulerModule`

## Usage

Using default scheduler (based on `Promise.then()`):

```typescript
import { ChangeDetectionSchedulerModule } from '@angular-contrib/core';

@NgModule({
  imports: [ ChangeDetectionSchedulerModule ],
})
class MyModule { }

platformBrowserDynamic.bootstrapModule(MyModule, { ngZone: 'noop' });
```

Providing custom scheduler:

```typescript
import { ChangeDetectionScheduler, ChangeDetectionSchedulerModule } from '@angular-contrib/core';

@Injectable()
class ImmediateTickScheduler implements ChangeDetectionScheduler {
  constructor(private appRef: ApplicationRef) { }

  schedule(): void {
    this.appRef.tick();
  }
}

@NgModule({
  imports: [ ChangeDetectionSchedulerModule ],
  providers: [
    { provide: ChangeDetectionScheduler, useClass: ImmediateTickScheduler },
  ],
})
class MyModule { }

platformBrowserDynamic.bootstrapModule(MyModule, { ngZone: 'noop' });
```

## Note

+ Depends on `markForCheck` integration like async pipe;

## Requirements

+ WeakMap;
