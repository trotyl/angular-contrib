import { ChangeDetectorRef, Component, EventEmitter, NgZone } from '@angular/core';
import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionScheduler } from './change-detection-scheduler';
import { ChangeDetectionSchedulerModule } from './change-detection-scheduler.module';

describe('ChangeDetectionScheduler', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  let mockScheduler: ChangeDetectionScheduler;

  const dummyNoopNgZone: NgZone = {
    hasPendingMicrotasks: false,
    hasPendingMacrotasks: false,
    isStable: true,
    onUnstable: new EventEmitter(),
    onMicrotaskEmpty: new EventEmitter(),
    onStable: new EventEmitter(),
    onError: new EventEmitter(),
    run(fn: () => any): any { return fn(); },
    runGuarded(fn: () => any): any { return fn(); },
    runOutsideAngular(fn: () => any): any { return fn(); },
    runTask(fn: () => any): any { return fn(); },
  };

  beforeEach(() => {
    mockScheduler = {
      schedule: jasmine.createSpy('schedule'),
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ChangeDetectionSchedulerModule],
      providers: [
        { provide: NgZone, useValue: dummyNoopNgZone },
        { provide: ChangeDetectionScheduler, useValue: mockScheduler },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should perform change detection after markForCheck', inject([ChangeDetectionScheduler], (scheduler: ChangeDetectionScheduler) => {
    component.changeDetectorRef.markForCheck();
    expect(scheduler.schedule).toHaveBeenCalled();
  }));
});

@Component({
  selector: 'test-cmp',
  template: ``,
})
class TestComponent {
  constructor(public changeDetectorRef: ChangeDetectorRef) { }
}
