import { Input, KeyValueDiffer, KeyValueDiffers, DoCheck, SimpleChanges, OnChanges, OnInit, ElementRef, Renderer2, Component, ViewChild, AfterContentInit, HostBinding, Directive } from '@angular/core';

const EMPTY_OBJ = {};

@Directive({
  selector: 'ng-dynamic',
})
export class NgDynamic implements AfterContentInit, DoCheck, OnChanges, OnInit {
  @Input() tag: string = 'ng-unknown';
  @Input() props: Record<string, unknown> = {};
  @Input() attrs: Record<string, string | null> = {};
  @Input() styles: Record<string, string | number | null> = {};

  @HostBinding('style.display') display = 'none';

  private hostParent!: Element;
  private el: Element | null = null;
  private propsDiffer: KeyValueDiffer<string, unknown> | null = null;
  private attrsDiffer: KeyValueDiffer<string, string | null> | null = null;
  private stylesDiffer: KeyValueDiffer<string, string | number | null> | null = null;

  constructor(
    private host: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private kvDiffers: KeyValueDiffers,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hostParent == null) {
      this.hostParent = this.renderer.parentNode(this.host.nativeElement);
    }

    if (changes['tag']) {
      this.createNewElement();
    }

    if (this.propsDiffer == null && changes['props']) {
      this.propsDiffer = this.kvDiffers.find(EMPTY_OBJ).create();
    }

    if (this.attrsDiffer == null && changes['attrs']) {
      this.attrsDiffer = this.kvDiffers.find(EMPTY_OBJ).create();
    }

    if (this.stylesDiffer == null && changes['styles']) {
      this.stylesDiffer = this.kvDiffers.find(EMPTY_OBJ).create();
    }
  }

  ngOnInit(): void {
    if (this.hostParent == null) {
      this.hostParent = this.renderer.parentNode(this.host.nativeElement);
    }

    if (this.el == null) {
      this.createNewElement();
    }
  }

  ngDoCheck(): void {
    if (this.propsDiffer != null) {
      const changes = this.propsDiffer.diff(this.props);
      if (changes != null) {
        changes.forEachRemovedItem((record) => this.setProp(record.key, null));
        changes.forEachAddedItem((record) => this.setProp(record.key, record.currentValue));
        changes.forEachChangedItem((record) => this.setProp(record.key, record.currentValue));
      }
    }

    if (this.attrsDiffer != null) {
      const changes = this.attrsDiffer.diff(this.attrs);
      if (changes != null) {
        changes.forEachRemovedItem((record) => this.setAttr(record.key, null));
        changes.forEachAddedItem((record) => this.setAttr(record.key, record.currentValue));
        changes.forEachChangedItem((record) => this.setAttr(record.key, record.currentValue));
      }
    }

    if (this.stylesDiffer != null) {
      const changes = this.stylesDiffer.diff(this.styles);
      if (changes != null) {
        changes.forEachRemovedItem((record) => this.setStyle(record.key, null));
        changes.forEachAddedItem((record) => this.setStyle(record.key, record.currentValue));
        changes.forEachChangedItem((record) => this.setStyle(record.key, record.currentValue));
      }
    }
  }

  ngAfterContentInit(): void {
    this.moveChildNodes(this.host.nativeElement, this.el!);
  }

  private createNewElement(): void {
    const newElement = this.renderer.createElement(this.tag);

    if (this.el != null) {
      this.renderer.insertBefore(this.hostParent, this.host.nativeElement, this.el);
      this.renderer.removeChild(this.hostParent, this.el);
      this.moveChildNodes(this.el, newElement);
    }

    this.el = newElement;

    const propKeys = Object.keys(this.props);
    const attrKeys = Object.keys(this.attrs);
    const styleKeys = Object.keys(this.styles);

    for (let i = 0; i < propKeys.length; i++) {
      const prop = propKeys[i];
      this.setProp(prop, this.props[prop]);
    }

    for (let i = 0; i < attrKeys.length; i++) {
      const attr = attrKeys[i];
      this.setProp(attr, this.attrs[attr]);
    }

    for (let i = 0; i < styleKeys.length; i++) {
      const style = styleKeys[i];
      this.setStyle(style, this.styles[style]);
    }

    this.renderer.insertBefore(this.hostParent, this.el, this.host.nativeElement);
    this.renderer.removeChild(this.hostParent, this.host.nativeElement);
  }

  private moveChildNodes(from: Node, to: Node): void {
    const nodes = this.renderer.childNodes(from);
    for (let i = 0; i < nodes.length; i++) {
      this.renderer.appendChild(to, nodes[i]);
    }
  }

  private setProp(name: string, value: unknown): void {
    this.renderer.setProperty(this.el, name, value);
  }

  private setAttr(name: string, value: string | null): void {
    if (value != null) {
      this.renderer.setAttribute(this.el, name, value);
    } else {
      this.renderer.removeAttribute(this.el, name);
    }
  }

  private setStyle(nameAndUnit: string, value: string | number | null): void {
    const [name, unit] = nameAndUnit.split('.');
    value = value != null && unit ? `${value}${unit}` : value;

    if (value != null) {
      this.renderer.setStyle(this.el, name, value as string);
    } else {
      this.renderer.removeStyle(this.el, name);
    }
  }
}
