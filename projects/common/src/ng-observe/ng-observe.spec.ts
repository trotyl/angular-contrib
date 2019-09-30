import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContribNgObserveModule } from './ng-observe.module';
import { NgObserve } from './ng-observe';
import { By } from '@angular/platform-browser';

describe('ng-observe', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ObserveChildrenComponent,
        ObserveMultiChildrenComponent,
        ObserveRangeComponent,
        ObserveMultiRangeComponent,
        TestComponent,
      ],
      imports: [CommonModule, ContribNgObserveModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should get observed content', () => {
    fixture.detectChanges();

    const c1 = fixture.debugElement.query(By.directive(ObserveChildrenComponent)).injector.get(ObserveChildrenComponent);
    expect(c1.observe.content.length).toBe(1);
    expect(c1.observe.content[0].textContent!.trim()).toBe(`Content`);
    expect(c1.events.length).toBe(1);

    const c2 = fixture.debugElement.query(By.directive(ObserveMultiChildrenComponent)).injector.get(ObserveMultiChildrenComponent);
    expect(c2.first.content.length).toBe(1);
    expect(c2.first.content[0].textContent!.trim()).toBe(`First`);
    expect(c2.second.content.length).toBe(1);
    expect(c2.second.content[0].textContent!.trim()).toBe(`Second`);
    expect(c2.firstEvents.length).toBe(1);
    expect(c2.secondEvents.length).toBe(1);

    const c3 = fixture.debugElement.query(By.directive(ObserveRangeComponent)).injector.get(ObserveRangeComponent);
    expect(c3.observe.content.length).toBe(1);
    expect(c3.observe.content[0].textContent!.trim()).toBe(`Content`);
    expect(c3.events.length).toBe(1);

    const c4 = fixture.debugElement.query(By.directive(ObserveMultiRangeComponent)).injector.get(ObserveMultiRangeComponent);
    expect(c4.first.content.length).toBe(1);
    expect(c4.first.content[0].textContent!.trim()).toBe(`First`);
    expect(c4.second.content.length).toBe(1);
    expect(c4.second.content[0].textContent!.trim()).toBe(`Second`);
    expect(c4.firstEvents.length).toBe(1);
    expect(c4.secondEvents.length).toBe(1);
  });
});

@Component({
  selector: 'test-observe-children',
  template: `
    Start
    <ng-observe (contentChange)="events.push($event)">
      <ng-content></ng-content>
    </ng-observe>
    End
  `,
})
class ObserveChildrenComponent {
  @ViewChild(NgObserve, { static: true }) observe!: NgObserve;

  events: Node[] = [];
}

@Component({
  selector: 'test-observe-multi-children',
  template: `
    Start
    <ng-observe #first (contentChange)="firstEvents.push($event)">
      <ng-content select=".first"></ng-content>
    </ng-observe>
    Middle
    <ng-observe #second (contentChange)="secondEvents.push($event)">
      <ng-content select=".second"></ng-content>
    </ng-observe>
    End
  `,
})
class ObserveMultiChildrenComponent {
  @ViewChild('first', { static: true }) first!: NgObserve;
  @ViewChild('second', { static: true }) second!: NgObserve;

  firstEvents: Node[] = [];
  secondEvents: Node[] = [];
}

@Component({
  selector: 'test-observe-range',
  template: `
    Start
    <ng-observe start (contentChange)="events.push($event)"></ng-observe>
    <ng-content></ng-content>
    <ng-observe end></ng-observe>
    End
  `,
})
class ObserveRangeComponent {
  @ViewChild(NgObserve, { static: true }) observe!: NgObserve;

  events: Node[] = [];
}

@Component({
  selector: 'test-observe-multi-range',
  template: `
    Start
    <ng-observe start #first (contentChange)="firstEvents.push($event)"></ng-observe>
    <ng-content select=".first"></ng-content>
    <ng-observe end></ng-observe>
    Middle
    <ng-observe start #second (contentChange)="secondEvents.push($event)"></ng-observe>
    <ng-content select=".second"></ng-content>
    <ng-observe end></ng-observe>
    End
  `,
})
class ObserveMultiRangeComponent {
  @ViewChild('first', { static: true }) first!: NgObserve;
  @ViewChild('second', { static: true }) second!: NgObserve;

  firstEvents: Node[] = [];
  secondEvents: Node[] = [];
}

@Component({
  template: `
    <test-observe-children>
      Content
    </test-observe-children>
    <test-observe-multi-children>
      <span class="first">First</span>
      <span class="second">Second</span>
    </test-observe-multi-children>
    <test-observe-range>
      Content
    </test-observe-range>
    <test-observe-multi-range>
      <span class="first">First</span>
      <span class="second">Second</span>
    </test-observe-multi-range>
  `,
})
class TestComponent {}
