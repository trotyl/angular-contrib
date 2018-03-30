import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchContinueModule } from './switch-continue.module';

describe('ngSwitchCaseContinue', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [CommonModule, SwitchContinueModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should display continued cases', () => {
    fixture.detectChanges();
    expect(component.textContent).toBe(`01`);

    fixture.detectChanges();
    expect(component.textContent).toBe(`01`);
  });

  it('should display non-continued cases', () => {
    component.value = 1;

    fixture.detectChanges();
    expect(component.textContent).toBe(`1`);

    fixture.detectChanges();
    expect(component.textContent).toBe(`1`);
  });

  it('should display default-continued cases', () => {
    component.value = 2;

    fixture.detectChanges();
    expect(component.textContent).toBe(`2+`);

    fixture.detectChanges();
    expect(component.textContent).toBe(`2+`);
  });

  it('should display default case', () => {
    component.value = 3;

    fixture.detectChanges();
    expect(component.textContent).toBe(`+`);

    fixture.detectChanges();
    expect(component.textContent).toBe(`+`);
  });

  it('should handle match change', () => {
    fixture.detectChanges();

    component.value = 1;

    fixture.detectChanges();
    expect(component.textContent).toBe(`1`);
  });

});

@Component({
  selector: 'test-cmp',
  template: `
    <div #container>
      <ng-container [ngSwitch]="value">
        <div *ngSwitchCase="0; continue: true">0</div>
        <div *ngSwitchCase="1; continue: false">1</div>
        <div *ngSwitchCase="2; continue: true">2</div>
        <div *ngSwitchDefault>+</div>
      </ng-container>
    </div>
  `,
})
class TestComponent {
  @ViewChild('container') container: ElementRef;

  value = 0;

  get textContent(): string {
    return this.container.nativeElement.textContent.replace(/\s/g, '');
  }
}
