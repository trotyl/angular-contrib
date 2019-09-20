import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContribNgLetModule } from './ng-let.module';

describe('ng-let', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [CommonModule, ContribNgLetModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should display continued cases', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe(`2`);
  });
});

@Component({
  template: `
    <ng-let [data]="1 + 1" #foo></ng-let>
    {{ foo.data }}
  `,
})
class TestComponent {}
