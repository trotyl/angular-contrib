# KeyValueDiffers Extensibility

Supports extending `KeyValueDiffers` with custom differ implementations.

## Type

**InjectionToken**

## Provenance

+ https://github.com/angular/angular/issues/11309

## NgModule

`@angular-contrib/core#ContribKeyValueDiffersModule`

## Usage

Providing custom `KeyValueDifferFactory` (Non-exclusive):

```typescript
import { ContribKeyValueDiffersModule, KEY_VALUE_DIFFER_FACTORIES } from '@angular-contrib/core';

@NgModule({
  imports: [ ContribKeyValueDiffersModule ],
  providers: [
    { provide: KEY_VALUE_DIFFER_FACTORIES, multi: true, useClass: FastDifferFactory },
  ]
})
class MyModule { }
```

## Note

+ Can only be provided in root scope;
