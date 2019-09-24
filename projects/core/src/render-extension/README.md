# Renderer Extension

Addition renderer methods for low-level operations.

## Type

**Provider**

## Provenance

None.

## NgModule

`@angular-contrib/core#ContribRenderExtensionModule`

## Usage

```typescript
@Component()
class MyComponent {
  constructor(private renderer: Renderer2) {}

  onAction(node: Node) {
    const childLength = this.renderer.childNodes(node).length;

    if (childLength === 0) {
      throw new Error(`No children available`);
    }
  }
}
```
