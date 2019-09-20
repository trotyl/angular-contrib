# NgLet

Helper component to store arbitrary data in template.

## Type

**Component**

## Provenance

+ https://github.com/angular/angular/issues/15280

## NgModule

`@angular-contrib/core#ContribNgLetModule`

## Usage

```typescript
@Component({
  template: `
    <ng-let [data]="1 * 2 + 3" #expensiveResult></ng-let>
    <p>Consumer 1: {{ expensiveResult.data }}</p>
    <p>Consumer 2: {{ expensiveResult.data }}</p>
  `
})
class MyComponent {}
```
