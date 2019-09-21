# IterableDiffers Extensibility

Supports extending `IterableDiffers` with custom differ implementations.

## Type

**InjectionToken**

## Provenance

+ https://github.com/angular/angular/issues/11309

## NgModule

`@angular-contrib/core#ContribIterableDiffersModule`

## Usage

Providing custom `IterableDifferFactory` (Non-exclusive):

```typescript
import { ContribIterableDiffersModule, ITERABLE_DIFFER_FACTORIES } from '@angular-contrib/core';

@NgModule({
  imports: [ ContribIterableDiffersModule ],
  providers: [
    { provide: ITERABLE_DIFFER_FACTORIES, multi: true, useClass: FastDifferFactory },
  ]
})
class MyModule { }
```

## Note

+ Can only be provided in root scope;
