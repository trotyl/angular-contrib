# Renderer Interception

Intercepting the render process.

## Type

**Provider**

## Provenance

+ https://github.com/angular/angular/issues/3929

## NgModule

`@angular-contrib/core#ContribRenderInterceptModule`

## Usage

```typescript
import { ContribRenderInterceptModule, RenderInterceptor, RENDER_INTERCEPTORS } from '@angular-contrib/core';

class LinkSpyInterceptor implements RenderInterceptor {
  setAttribute(el: Element, name: string, value: string, namespace: string | undefined, renderer: Renderer2) {
    if (el.tagName === 'A' && name === 'href') {
      console.log(`New link found: ${value}`);
    }
    return renderer.setAttribute(el, name, value, namespace);
  }
}

@NgModule({
  imports: [ ContribRenderInterceptModule ],
  providers: [
    { provide: RENDER_INTERCEPTORS, multi: true, useClass: LinkSpyInterceptor },
  ]
})
class MyModule { }
```

## Requirements

+ ContribRenderInterceptModule
