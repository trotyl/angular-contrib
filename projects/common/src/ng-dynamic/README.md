# NgDynamic

Helper directive to render dynamic tag.

## Type

**Directive**

## Provenance

None.

## NgModule

`@angular-contrib/core#ContribNgDynamicModule`

## Usage

```typescript
@Component({
  template: `
    <ng-dynamic [tag]="tag" [props]="props" [attrs]="attrs" [styles]="styles"></ng-dynamic>
  `
})
class MyComponent {}
```
