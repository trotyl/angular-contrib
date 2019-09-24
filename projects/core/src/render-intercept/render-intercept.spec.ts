import { Renderer2, Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RenderInterceptor, RENDER_INTERCEPTORS } from './render-intercept';
import { ContribRenderInterceptModule } from './render-intercept.module';

describe('Renderer interception', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let interceptor: RenderInterceptor;

  beforeEach(() => {
    interceptor = {
      setAttribute(el: Element, name: string, value: string, namespace: string | undefined, renderer: Renderer2) {
        if (value === 'foo') {
          value = 'bar';
        }
        return renderer.setAttribute(el, name, value, namespace);
      },
      createText(value: string, renderer: Renderer2) {
        if (value === 'ABC') {
          value = 'DEF';
        }
        return renderer.createText(value);
      }
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContribRenderInterceptModule],
      declarations: [TestComponent],
      providers: [
        { provide: RENDER_INTERCEPTORS, multi: true, useValue: interceptor },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should apply RenderInterceptor', () => {
    expect(fixture.nativeElement.innerHTML).toBe(`<article id="bar">DEF</article>`);
  });

});

@Component({
  template: `<article id="foo">ABC</article>`,
})
class TestComponent {}
