import {Directive, OnChanges, Input, ElementRef} from "@angular/core";

@Directive({selector: "[bind-attrs]"})
export class BindAttrsDirective implements OnChanges {
    @Input("bind-attrs")
    public bindAttrs: ElementRef<HTMLElement> | undefined;

    constructor(private elementRef : ElementRef<HTMLElement>) {}

    public ngOnChanges(): void {
        if (this.bindAttrs) {
            var attrs = this.bindAttrs.nativeElement.attributes;
            for (let index = 0; index < attrs.length; index++) {
                if (!attrs[index].name.startsWith("_ng")) {
                    // don't break view encapsulation
                    this.elementRef.nativeElement.setAttributeNode(attrs[index].cloneNode() as Attr);
                }
            }
        }
    }
}
