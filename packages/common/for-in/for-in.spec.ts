import { Component, ElementRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ForInModule } from './for-in.module';

describe('ngForIn', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ForInModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should reflect initial elements', () => {
    fixture.detectChanges();

    expect(component.textContent).toBe(`a:1;b:2;`);
  });

  it('should reflect added elements via modification', () => {
    fixture.detectChanges();

    component.obj.c = 3;

    fixture.detectChanges();
    expect(component.textContent).toBe(`a:1;b:2;c:3;`);
  });

  it('should reflect added elements via replacement', () => {
    fixture.detectChanges();

    component.obj = {...component.obj, c: 3};

    fixture.detectChanges();
    expect(component.textContent).toBe(`a:1;b:2;c:3;`);
  });

  it('should reflect removed elements via modification', () => {
    fixture.detectChanges();

    delete component.obj['b'];

    fixture.detectChanges();
    expect(component.textContent).toBe(`a:1;`);
  });

  it('should reflect removed elements via replacement', () => {
    fixture.detectChanges();

    component.obj = {a: 1};

    fixture.detectChanges();
    expect(component.textContent).toBe(`a:1;`);
  });

  it('should reflect changing elements via modification', () => {
    fixture.detectChanges();

    component.obj['b'] = 0;

    fixture.detectChanges();
    expect(component.textContent).toBe(`a:1;b:0;`);
  });

  it('should reflect changing elements via replacement', () => {
    fixture.detectChanges();

    component.obj = {a: 1, b: 0};

    fixture.detectChanges();
    expect(component.textContent).toBe(`a:1;b:0;`);
  });

  it('should iterate over a Map', async(() => {
    component.obj = new Map([['b', 2], ['a', 1]]);

    fixture.detectChanges();
    expect(component.textContent).toBe(`b:;a:;`);
  }));

  it('should gracefully handle nulls', async(() => {
    component.obj = null;

    fixture.detectChanges();
    expect(component.textContent).toBe(``);
  }));

  it('should gracefully handle ref changing to null and back', async(() => {
    fixture.detectChanges();
    expect(component.textContent).toBe(`a:1;b:2;`);

    component.obj = null;

    fixture.detectChanges();
    expect(component.textContent).toBe(``);

    component.obj = {a: 1, b: 2};

    fixture.detectChanges();
    expect(component.textContent).toBe(`a:1;b:2;`);
  }));
});

@Component({
  selector: 'test-cmp',
  template: `
    <div #container><span *ngFor="let key in obj">{{key}}:{{obj[key]}};</span></div>
  `,
})
class TestComponent {
  @ViewChild('container') container: ElementRef;
  obj: any = {a: 1, b: 2};

  get textContent(): string {
    return this.container.nativeElement.textContent;
  }
}
