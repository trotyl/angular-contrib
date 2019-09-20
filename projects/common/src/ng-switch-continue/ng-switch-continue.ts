import { Directive, DoCheck, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

export abstract class SwitchViewHandler {
  protected abstract view: EmbeddedViewRef<any>|null = null;
  protected abstract vcRef: ViewContainerRef;
  protected abstract template: TemplateRef<any>;

  protected createView(): void {
    if (!this.view) {
      this.view = this.vcRef.createEmbeddedView(this.template);
    }
  }

  protected removeView(): void {
    if (this.view) {
      this.vcRef.remove(this.vcRef.indexOf(this.view));
      this.view = null;
    }
  }
}

@Directive({
  selector: '[ngSwitch]',
})
export class NgSwitchPatcher implements DoCheck {
  @Input() ngSwitch: any;

  continue: boolean = false;

  ngDoCheck(): void {
    this.continue = false;
  }

  matchCase(value: any): boolean {
    // tslint:disable-next-line:triple-equals
    return value == this.ngSwitch;
  }
}

@Directive({
  selector: '[ngSwitchCase]',
})
export class NgSwitchCasePatcher extends SwitchViewHandler implements DoCheck {
  @Input() ngSwitchCase: any;
  @Input() ngSwitchCaseContinue: boolean = false;

  protected view: EmbeddedViewRef<any>|null = null;

  constructor(
    protected vcRef: ViewContainerRef,
    protected template: TemplateRef<any>,
    private host: NgSwitchPatcher,
  ) {
    super();
  }

  ngDoCheck(): void {
    if (this.host.matchCase(this.ngSwitchCase)) {
      this.removeView();
      this.host.continue = this.ngSwitchCaseContinue;
    } else if (this.host.continue) {
      this.createView();
      this.host.continue = this.ngSwitchCaseContinue;
    } else {
      this.removeView();
    }
  }
}

@Directive({
  selector: '[ngSwitchDefault]',
})
export class NgSwitchDefaultPatcher extends SwitchViewHandler implements DoCheck {
  protected view: EmbeddedViewRef<any>|null = null;

  constructor(
    protected vcRef: ViewContainerRef,
    protected template: TemplateRef<any>,
    private host: NgSwitchPatcher,
  ) {
    super();
  }

  ngDoCheck(): void {
    if (this.host.continue) {
      this.createView();
    } else {
      this.removeView();
    }
  }
}
