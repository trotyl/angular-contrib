# NgNoHost

Hide host elements whenever an `ngNoHost` attribute occurs.
For example: 

```typescript
@Component({
  selector: 'my-cmp',
  template: `Foo <ng-content></ng-content> Bar`,
  host: {
    '[attr.ngNoHost]': '',
  }
})
class MyComponent {}
```

```html
<div>
  <my-cmp>Content</my-cmp>
</div>
```

Will result to:

```html
<div>
  Foo Content Bar
</div>
```

## Type

**Provider**

## Provenance

+ https://github.com/angular/angular/issues/18877

## NgModule

`@angular-contrib/core#ContribNgNoHostModule`

## Usage

```typescript
@Component({
  host: {
    '[attr.ngNoHost]': '',
  },
  template: `
    Hello {{ name }}!
  `
})
class MyComponent {
  name = 'World';
}
```
