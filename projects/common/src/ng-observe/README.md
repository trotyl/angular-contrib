# NgObserve

Helper component to retrieve the projected content.

## Type

**Component**

## Provenance

+ https://github.com/angular/angular/issues/29395

## NgModule

`@angular-contrib/core#ContribNgObserveModule`

## Usage

```typescript
@Component({
  template: `
    <!-- As Host -->
    <ng-observe (contentChange)="onContentChange($event)">
      <ng-content></ng-content>
    </ng-observe>

    <!-- As Marker -->
    <ng-observe start (contentChange)="onContentChange($event)"></ng-observe>
    <ng-content></ng-content>
    <ng-observe end></ng-observe>
  `
})
class MyComponent {
  onContentChange(content: Node[]) {
    console.log(content);
  }
}
```
