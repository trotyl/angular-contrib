import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContribNgInitModule } from './init.module';

describe('ngForIn', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ContribNgInitModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should perform statement during init', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toBe(`2`);
  });
});

@Component({
  template: `<p (ngInit)="value = 2">{{ value }}</p>`,
})
class TestComponent {
  value = 1;
}
