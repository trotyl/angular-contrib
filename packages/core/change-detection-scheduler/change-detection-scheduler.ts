import { ApplicationRef, ChangeDetectorRef, Component, Injectable, NgZone } from '@angular/core';

const SCHEDULER_PATCHED = new WeakSet<ChangeDetectorRef>();
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
    const markForCheck = cdRef.markForCheck;

    const scheduleTickIfNeeded = () => {
      if (!(ngZone instanceof NgZone) && !tickScheduled) {
        scheduler.schedule();
      }
    };

    while (typeof cdRef === 'object' && !cdRef.hasOwnProperty('markForCheck') && cdRef.constructor.prototype) {
      cdRef = cdRef.constructor.prototype;
    }

    if (!SCHEDULER_PATCHED.has(cdRef)) {
      cdRef.markForCheck = function () {
        markForCheck.call(this);
        scheduleTickIfNeeded();
      };

      SCHEDULER_PATCHED.add(cdRef);
    }
  }
}
