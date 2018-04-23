import { Component, EventEmitter, ViewChild } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgNoCheck } from './no-check';
import { ContribNgNoCheckModule } from './no-check.module';

describe('NgNoCheck', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ContribNgNoCheckModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should not update non-check sections', fakeAsync(() => {
    fixture.detectChanges();
    component.scheduleChange();
    tick(1000);
    fixture.detectChanges();

    expect(component.staticValue).toBe(1);
    expect(component.dynamicValue).toBe(1);
    expect(fixture.nativeElement.textContent).toBe('1-0');
  }));
});

describe('NgNoCheck with condition', () => {
  let fixture: ComponentFixture<TestComponentWithCondition>;
  let component: TestComponentWithCondition;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponentWithCondition],
      imports: [ContribNgNoCheckModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWithCondition);
    component = fixture.componentInstance;
  });

  it('should update non-check sections if condition allows', fakeAsync(() => {
    fixture.detectChanges();
    component.condition = false;
    component.scheduleChange();
    tick(1000);

    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('1-1');
  }));
});

describe('NgNoCheck with manual trigger', () => {
  let fixture: ComponentFixture<TestComponentWithTrigger>;
  let component: TestComponentWithTrigger;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponentWithTrigger],
      imports: [ContribNgNoCheckModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWithTrigger);
    component = fixture.componentInstance;
  });

  it('should update non-check sections when triggered', fakeAsync(() => {
    fixture.detectChanges();
    component.scheduleChange();
    tick(1000);

    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('1-0');

    component.ngNoCheck.check();
    expect(fixture.nativeElement.textContent).toBe('1-1');
  }));
});

describe('NgNoCheck with notifier', () => {
  let fixture: ComponentFixture<TestComponentWithNotifier>;
  let component: TestComponentWithNotifier;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponentWithNotifier],
      imports: [ContribNgNoCheckModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWithNotifier);
    component = fixture.componentInstance;
  });

  it('should update non-check sections when notifier fires', fakeAsync(() => {
    fixture.detectChanges();
    component.scheduleChange();
    tick(1000);

    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('1-0');

    component.emitter.emit();
    expect(fixture.nativeElement.textContent).toBe('1-1');
  }));

  it('should support changing notifier', fakeAsync(() => {
    fixture.detectChanges();
    component.scheduleChange();
    tick(1000);

    const oldEmitter = component.emitter;
    component.emitter = new EventEmitter<void>();

    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('1-0');

    oldEmitter.emit();
    expect(fixture.nativeElement.textContent).toBe('1-0');

    component.emitter.emit();
    expect(fixture.nativeElement.textContent).toBe('1-1');
  }));

  it('should support removing notifier', fakeAsync(() => {
    fixture.detectChanges();
    component.scheduleChange();
    tick(1000);

    const oldEmitter = component.emitter;
    component.emitter = null!;

    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('1-0');

    oldEmitter.emit();
    expect(fixture.nativeElement.textContent).toBe('1-0');
  }));
});

@Component({
  selector: 'test-cmp',
  template: `{{ dynamicValue }}-<span *ngNoCheck>{{ staticValue }}</span>`,
})
class TestComponent {
  dynamicValue = 0;
  staticValue = 0;

  scheduleChange(): void {
    setTimeout(() => {
      this.dynamicValue++;
      this.staticValue++;
    }, 1000);
  }
}

@Component({
  selector: 'test-cmp',
  template: `{{ dynamicValue }}-<span *ngNoCheck="condition">{{ staticValue }}</span>`,
})
class TestComponentWithCondition {
  dynamicValue = 0;
  staticValue = 0;
  condition = true;

  scheduleChange(): void {
    setTimeout(() => {
      this.dynamicValue++;
      this.staticValue++;
    }, 1000);
  }
}

@Component({
  selector: 'test-cmp',
  template: `{{ dynamicValue }}-<span *ngNoCheck>{{ staticValue }}</span>`,
})
class TestComponentWithTrigger {
  @ViewChild(NgNoCheck) ngNoCheck: NgNoCheck;

  dynamicValue = 0;
  staticValue = 0;

  scheduleChange(): void {
    setTimeout(() => {
      this.dynamicValue++;
      this.staticValue++;
    }, 1000);
  }
}

@Component({
  selector: 'test-cmp',
  template: `{{ dynamicValue }}-<span *ngNoCheck="true; notifier: emitter">{{ staticValue }}</span>`,
})
class TestComponentWithNotifier {
  emitter = new EventEmitter<void>();

  dynamicValue = 0;
  staticValue = 0;

  scheduleChange(): void {
    setTimeout(() => {
      this.dynamicValue++;
      this.staticValue++;
    }, 1000);
  }
}
