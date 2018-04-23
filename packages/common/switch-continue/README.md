# NgSwitchContinue

Helper directive for matching multiple cases in `NgSwitch`.

## Type

**Directive**

## Provenance

+ https://github.com/angular/angular/issues/19824

## NgModule

`@angular-contrib/common#ContribNgSwitchContinueModule`

## Usage

Adds aditional `[ngSwitchCaseContinue]="true"` to `ngSwitchCase`:

```typescript
@Component({
  template: `
    <ng-container [ngSwitch]="value">
      <div *ngSwitchCase="0; continue: true">A</div>
      <div *ngSwitchCase="1; continue: true">B</div>
      <div *ngSwitchCase="2; continue: false">C</div>
      <div *ngSwitchDefault>D</div>
    </ng-container>
  `
})
class MyComponent {
  value = 0;
}
```

## Note

+ Using explicit `continue` rather than `break` for compatibility;
