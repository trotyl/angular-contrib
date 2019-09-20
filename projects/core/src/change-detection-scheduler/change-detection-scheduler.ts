import { ApplicationRef, ChangeDetectorRef, Component, Injectable, NgZone } from '@angular/core';

const APPLICATIONS = new WeakMap<ChangeDetectorRef, ApplicationRef>();
const SCHEDULERS = new WeakMap<ApplicationRef, ChangeDetectionScheduler>();
// tslint:disable-next-line:ban-types
const PATCHED = new WeakSet<Function>();
let tickScheduled = false;

export abstract class ChangeDetectionScheduler {
  abstract schedule(): void;
}

@Injectable()
export class ChangeDetectionScheduler_ implements ChangeDetectionScheduler {
  constructor(private appRef: ApplicationRef) { }

  schedule(): void {
    tickScheduled = true;
    Promise.resolve(null).then(() => {
      tickScheduled = false;
      this.appRef.tick();
    });
  }
}

@Component({
  template: '',
})
export class ChangeDetectionSchedulerInitializer {
  constructor(appRef: ApplicationRef, cdRef: ChangeDetectorRef, ngZone: NgZone, scheduler: ChangeDetectionScheduler) {
    if (!SCHEDULERS.has(appRef)) {
      interceptApplicationRef(appRef);
      SCHEDULERS.set(appRef, scheduler);
    }

    if (!PATCHED.has(cdRef.checkNoChanges)) {
      interceptChangeDetectorRef(cdRef);
      PATCHED.add(cdRef.checkNoChanges);
    }
  }
}

let activeApp: ApplicationRef | null = null;
let lastActiveApp: ApplicationRef | null = null;

function interceptApplicationRef(appRef: ApplicationRef): void {
  const tick = appRef.tick;

  appRef.tick = function() {
    activeApp = lastActiveApp = this;
    tick.call(this);
    activeApp = null;
  };
}

function interceptChangeDetectorRef(cdRef: ChangeDetectorRef): void {
  const detectChanges = cdRef.detectChanges;
  const markForCheck = cdRef.markForCheck;

  let proto = cdRef;
  while (proto !== Object.prototype) {
    if (proto.hasOwnProperty('markForCheck')) {
      break;
    }
    proto = (proto as any).__proto__;
  }

  proto.detectChanges = function() {
    if (!APPLICATIONS.has(this) && activeApp != null) {
      APPLICATIONS.set(this, activeApp);
    }
    detectChanges.call(this);
  };

  proto.markForCheck = function() {
    const appRef = APPLICATIONS.has(this) ? APPLICATIONS.get(this)! : lastActiveApp;
    if (appRef != null && SCHEDULERS.has(appRef)) {
      const scheduler = SCHEDULERS.get(appRef)!;
      scheduler.schedule();
    }
    markForCheck.call(this);
  };
}
