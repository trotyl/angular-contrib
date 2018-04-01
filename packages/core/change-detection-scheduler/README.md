# Auto Change Detection with NoopZone

Automatically trigger change detection without Zone.js.

## Type

**Enhancement**

## Provenance

+ https://github.com/angular/angular/issues/20204

## NgModule

`@angular-contrib/core#ChangeDetectionSchedulerModule`

## Usage

```typescript
import { ChangeDetectionSchedulerModule } from '@angular-contrib/core';

@NgModule({
  imports: [ ChangeDetectionSchedulerModule ],
})
class MyModule { }

platformBrowserDynamic.bootstrapModule(MyModule, { ngZone: 'noop' });
```

## Note

+ Depends on `markForCheck` integration like async pipe;

## Requirements

+ WeakSet;
