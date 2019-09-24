import { Renderer2, Component, ElementRef } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ContribRenderExtensionModule } from './render-extension.module';

describe('Renderer extension', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContribRenderExtensionModule],
      declarations: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should support childNodes', () => {
    expect(component.childNodes.length).toBe(3);
  });

});

@Component({
  template: `<p><p><p>`,
})
class TestComponent {
  constructor(
    private host: ElementRef,
    private renderer: Renderer2,
  ) {}

  get childNodes() {
    return this.renderer.childNodes(this.host.nativeElement);
  }
}
