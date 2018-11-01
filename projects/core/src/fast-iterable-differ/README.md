# FastIterableDiffer

An optimized `IterableDiffer` inspired by [Inferno](https://github.com/infernojs/inferno).

## Type

**Provider**

## Provenance

+ https://github.com/angular/angular/issues/18178

## NgModule

`@angular-contrib/core#ContribFastIterableDifferModule`

## Usage

```typescript
@NgModule({
  imports: [ ContribFastIterableDifferModule ],
})
class MyModule { }
```

## Note

+ Non-keyed by default, please provide `trackBy` when expecting keyed behavior;
+ Duplicate keys are not allowed;
+ The operations detected will be different, but the result is same;

## Requirements

+ Map;
+ Object.is;
