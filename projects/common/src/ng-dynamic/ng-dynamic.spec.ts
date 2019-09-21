import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContribNgDynamicModule } from './ng-dynamic.module';
import { By } from '@angular/platform-browser';

describe('ng-dynamic', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [CommonModule, ContribNgDynamicModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should render dynamic element', () => {
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.css('section'));

    expect(elements[0].nativeElement.outerHTML).toBe(`<section>Content</section>`);
    expect(elements[1].nativeElement.outerHTML).toBe(`<section id="test-id">Content</section>`);
    expect(elements[2].nativeElement.outerHTML).toBe(`<section title="test-title">Content</section>`);
    expect(elements[3].nativeElement.outerHTML).toBe(`<section style="height: 50px;">Content</section>`);
  });

  it('should support changing tag name', () => {
    fixture.detectChanges();

    component.tag = 'article';
    component.props = { id: 'test-id2' };
    component.attrs = { title: 'test-title2' };
    component.styles = { height: '60px' };
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.css('article'));

    expect(elements[0].nativeElement.outerHTML).toBe(`<article>Content</article>`);
    expect(elements[1].nativeElement.outerHTML).toBe(`<article id="test-id2">Content</article>`);
    expect(elements[2].nativeElement.outerHTML).toBe(`<article title="test-title2">Content</article>`);
    expect(elements[3].nativeElement.outerHTML).toBe(`<article style="height: 60px;">Content</article>`);
  });
});

@Component({
  template: `
    <ng-dynamic [tag]="tag">Content</ng-dynamic>
    <ng-dynamic [tag]="tag" [props]="props">Content</ng-dynamic>
    <ng-dynamic [tag]="tag" [attrs]="attrs">Content</ng-dynamic>
    <ng-dynamic [tag]="tag" [styles]="styles">Content</ng-dynamic>
  `,
})
class TestComponent {
  tag = 'section';
  props = { id: 'test-id' };
  attrs = { title: 'test-title' };
  styles = { height: '50px' };
}
