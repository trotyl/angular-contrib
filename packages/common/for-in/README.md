# NgForIn

Alternative to `NgForOf` for objects or maps.

## Provenance

+ https://github.com/angular/angular/issues/16430

## NgModule

`@angular-contrib/common#ForInModule`

## Usage

Iterating with object:

```typescript
@Component({
  template: `
    <ul>
      <li *ngFor="let key in items">{{ key }} - {{ items[key] }}</li>
    </ul>
  `
})
class MyComponent {
  items = {
    'apple': '$1.00',
    'banana': '$2.00',
    'cherry': '$3.00',
  };
}
```

Iterating with Map:

```typescript
@Component({
  template: `
    <ul>
      <li *ngFor="let key in items">{{ key }} - {{ items.get(key) }}</li>
    </ul>
  `
})
class MyComponent {
  items = new Map([
    ['apple', '$1.00'],
    ['banana', '$2.00'],
    ['cherry', '$3.00'],
  ]);
}
```

## Note

When using objects, keys are sorted alphabetically to make order consistent in all browsers.
