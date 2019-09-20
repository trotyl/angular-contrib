# NgNoCheck

Disable automatical change detection for certain fragments.

## Type

**Directive**

## Provenance

+ https://github.com/angular/angular/issues/14033

## NgModule

`@angular-contrib/common#ContribNgNoCheckModule`

## Usage

Simple one-time binding:

```typescript
@Component({
  template: `
    <p>
      Should update: {{ dynamicValue }}
    </p>
    <p *ngNoCheck>
      Should not update: {{ staticValue }}
    </p>
  `
})
class MyComponent {
  dynamicValue = 0;
  staticValue = 0;

  constructor() {
    setInterval(() => {
      this.dynamicValue++;
      this.staticValue++;
    }, 1000);
  }
}
```

Conditional freeze:

```typescript
@Component({
  template: `
    <p *ngNoCheck="value % 10 < 5">
      Should update after each 5: {{ value }}
    </p>
  `
})
class MyComponent {
  value = 0;

  constructor() {
    setInterval(() => {
      this.value++;
    }, 1000);
  }
}
```

Manual invocation:

```typescript
@Component({
  template: `
    <p *ngNoCheck="let checker">
      Should update when click: {{ value }}
    </p>
    <button (click)="checker.check()">Update</button>
  `
})
class MyComponent {
  value = 0;

  constructor() {
    setInterval(() => {
      this.value++;
    }, 1000);
  }
}
```

Reactive notification:

```typescript
@Component({
  template: `
    <p *ngNoCheck="true; notifier: interval$">
      Should update every 5s: {{ value }}
    </p>
  `
})
class MyComponent {
  value = 0;
  interval$ = interval(5000);

  constructor() {
    setInterval(() => {
      this.value++;
    }, 1000);
  }
}
```

## Note

+ Check invocation will be skipped if condition is `false`;
