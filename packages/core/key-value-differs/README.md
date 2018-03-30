# KeyValueDiffers Extensibility

Supports extending `KeyValueDiffers` with custom differ implementations.

## Type

**InjectionToken**

## Provenance

+ https://github.com/angular/angular/issues/11309

## NgModule

`@angular-contrib/core#KeyValueDiffersModule`

## Usage

Providing custom `KeyValueDifferFactory`:

```typescript
import { KeyValueDiffersModule } from '@angular-contrib/core';

const customKeyValueDifferFactories = [ FastDifferFactory ];

@NgModule({
  imports: [ KeyValueDiffersModule.extend(customKeyValueDifferFactories) ],
})
class MyModule { }
```

## Note

+ Can only be provided in root scope;
