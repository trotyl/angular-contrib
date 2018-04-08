# NgInit

Helper directive to perform side-effects in template.

## Type

**Directive**

## Provenance

+ https://github.com/angular/angular/issues/6585

## NgModule

`@angular-contrib/core#InitModule`

## Usage

```typescript
@Component({
  template: `
    <p (ngInit)="value = 'Bar'">
      Will be Bar: {{ value }}
    </p>
  `
})
class MyComponent {
  value = 'Foo';
}
```

## Note

+ Please do not use this when possible;
+ The order is equivant to `OnInit` hook on the given element;
