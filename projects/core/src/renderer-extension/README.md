# Renderer Extension

Addition renderer methods for low-level operations.

## Type

**Service**

## Provenance

None.

## NgModule

`@angular-contrib/core#ContribRendererExtensionModule`

## Usage

```typescript
import { RendererExtension } from '@angular-contrib/core';

@Component()
class MyComponent {
  constructor(private rendererEx: RendererExtension) {}

  onAction(node: Node) {
    const childLength = this.rendererEx.getChildNodes(node).length;

    if (childLength === 0) {
      throw new Error(`No children available`);
    }
  }
}
```
