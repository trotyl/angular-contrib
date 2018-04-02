import { ApplicationRef, ChangeDetectorRef, Component, Injectable, NgZone } from '@angular/core';

const SCHEDULER_PATCHED = new WeakMap<ChangeDetectorRef, ApplicationRef>();
const ORIGINAL_MARK_FOR_CHECK = '__markForCheck__';
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
    while (typeof cdRef === 'object' && !cdRef.hasOwnProperty('markForCheck') && cdRef.constructor.prototype) {
      cdRef = cdRef.constructor.prototype;
    }

    if (!SCHEDULER_PATCHED.has(cdRef) || SCHEDULER_PATCHED.get(cdRef) !== appRef) {
      if ((cdRef as any)[ORIGINAL_MARK_FOR_CHECK] == null) {
        (cdRef as any)[ORIGINAL_MARK_FOR_CHECK] = cdRef.markForCheck;
      }
      cdRef.markForCheck = function () {
        (cdRef as any)[ORIGINAL_MARK_FOR_CHECK].call(this);
        if (!(ngZone instanceof NgZone) && !tickScheduled) {
          scheduler.schedule();
        }
      };

      SCHEDULER_PATCHED.set(cdRef, appRef);
    }
  }
}
