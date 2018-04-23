# NgHost

Helper directive for using `NgClass` and `NgStyle` on host element.

## Type

**Directive**

## Provenance

+ https://github.com/angular/angular/issues/19119

## NgModule

`@angular-contrib/common#ContribNgHostModule`

## Usage

Programmatically binding classes, styles, attributes and properties to host element:

```typescript
@Component({
  template: `
    <ng-host class="foo bar" [ngClass]="{'dynamic': true}"
             style="color: red;" [ngStyle]="{'font-size': '36px'}"
             tabindex="42" [attr.title]="'title'"
             [hidden]="true">
    </ng-host>
  `
})
class MyComponent { }
```

## Note

+ The `<ng-host>` element must be direct child of component;
+ Content projection for `<ng-host>` element is meaningless and not supported;
+ Event binding are not supported for now due to technically limitation;

## Requirements

+ WeakMap;
+ WeakSet;
