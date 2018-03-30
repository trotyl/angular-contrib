import { Directive, DoCheck, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

const NG_SWITCH_CONTINUE_PATCHED = '__ng_contrib_switch_continue_patched__';

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
export class NgSwitchCasePatcher implements DoCheck {
  @Input() ngSwitchCase: any;
  @Input() ngSwitchCaseContinue: boolean = false;

  private created = false;

  constructor(private vcRef: ViewContainerRef, private template: TemplateRef<any>, private host: NgSwitchPatcher) { }

  ngDoCheck(): void {
    if (this.host.matchCase(this.ngSwitchCase) && this.ngSwitchCaseContinue) {
      this.host.continue = true;
    } else if (this.host.continue) {
      if (!this.created) {
        this.vcRef.createEmbeddedView(this.template);
        this.created = true;
      }
      this.host.continue = this.ngSwitchCaseContinue;
    } else {
      if (this.created) {
        this.vcRef.clear();
        this.created = false;
      }
    }
  }
}

@Directive({
  selector: '[ngSwitchDefault]',
})
export class NgSwitchDefaultPatcher implements DoCheck {
  private created = false;

  constructor(private vcRef: ViewContainerRef, private template: TemplateRef<any>, private host: NgSwitchPatcher) { }

  ngDoCheck(): void {
    if (this.host.continue) {
      if (!this.created) {
        this.vcRef.createEmbeddedView(this.template);
        this.created = true;
      }
    } else {
      if (this.created) {
        this.vcRef.clear();
        this.created = false;
      }
    }
  }
}
