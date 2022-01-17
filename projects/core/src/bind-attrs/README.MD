# bind-attrs
Helper directive to bind all attributes of an HTMLElement.

## Type

**Directive**

## Provenance

None.

## Usage

```html
// View

<a [bind-attrs]="elementRef" class="badge badge-primary">Primary</a>
```

```ts
// ViewModel

@Component({
  selector: 'badge',
  templateUrl: './badge.component.html'
})
export class BadgeComponent implements OnInit {

  constructor(
    // You should add this.
    public elementRef: ElementRef<HTMLElement>
  ) { }

}
```

Now `<badge>` supports all `<a>` attributes.

```html
<badge href="http://www.google.com"></badge>
```
