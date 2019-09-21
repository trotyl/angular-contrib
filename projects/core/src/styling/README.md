# Styling

Styling utility.

## Type

**Service**

## Provenance

None.

## NgModule

`@angular-contrib/core#ContribStylingModule`

## Usage

```typescript
@Component()
class MyComponent implements OnDestroy {
  private disposeGlobalStyle: () => void;

  constructor(
    styling: Styling,
  ) {
    this.disposeGlobalStyle = styling.addGlobalStyle(`body { color: red; }`);
  }

  ngOnDestroy(): void {
    this.disposeGlobalStyle();
  }
}
```
