import { Component, ElementRef, HostBinding, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContribNgHostModule } from './host.module';

function classListOf(element: HTMLElement): string[] {
  return Array.from(element.classList).sort();
}

function stylesOf(element: HTMLElement): {[key: string]: string} {
  return element.style as any;
}

function attributesOf(element: HTMLElement): {[key: string]: string} {
  const res: {[key: string]: string} = {};
  for (let i = 0; i < element.attributes.length; i++) {
    res[element.attributes[i].name] = element.attributes[i].value;
  }
  return res;
}

describe('NgHost', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ContribNgHostModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should render host element className', () => {
    fixture.detectChanges();

    expect(classListOf(component.hostElement)).toEqual(['bar', 'dynamic', 'foo']);
  });

  it('should render host element style', () => {
    fixture.detectChanges();

    const styles = stylesOf(component.hostElement);
    expect(styles['color']).toBe('red');
    expect(styles['fontSize']).toBe('36px');
  });

  it('should render host element attribute', () => {
    fixture.detectChanges();

    const attrs = attributesOf(component.hostElement);
    expect(attrs['tabindex']).toBe('42');
    expect(attrs['title']).toBe('title');
  });

  it('should render host element property', () => {
    fixture.detectChanges();

    expect(component.hostElement.hidden).toBe(true);
  });

  it('should not affect other children', () => {
    fixture.detectChanges();

    const classList = classListOf(component.childElement);
    const styles = stylesOf(component.childElement);
    const attrs = attributesOf(component.childElement);

    expect(classList).toEqual(['bar', 'dynamic', 'foo']);
    expect(styles['color']).toBe('red');
    expect(styles['fontSize']).toBe('36px');
    expect(attrs['tabindex']).toBe('42');
    expect(attrs['title']).toBe('title');
    expect(component.childElement.hidden).toBe(true);
  });
});

describe('NgHost with HostBinding', () => {
  let fixture: ComponentFixture<TestComponentWithHost>;
  let component: TestComponentWithHost;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponentWithHost],
      imports: [ContribNgHostModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWithHost);
    component = fixture.componentInstance;
  });

  it('should override host class binding', () => {
    fixture.detectChanges();

    expect(classListOf(component.hostElement)).toEqual(['foo']);
  });

  it('should override host style binding', () => {
    fixture.detectChanges();

    expect(stylesOf(component.hostElement)['color']).toBe('red');
  });

  it('should override host attribute binding', () => {
    fixture.detectChanges();

    expect(attributesOf(component.hostElement)['tabindex']).toBe('42');
  });

  it('should override host property binding', () => {
    fixture.detectChanges();

    expect(component.hostElement.hidden).toBe(true);
  });
});

@Component({
  template: `
    <ng-host class="foo bar" [ngClass]="{'dynamic': true}"
             style="color: red;" [ngStyle]="{'font-size': '36px'}"
             tabindex="42" [attr.title]="'title'" [hidden]="true">
    </ng-host>
    <div #normal
         class="foo bar" [ngClass]="{'dynamic': true}"
         style="color: red;" [ngStyle]="{'font-size': '36px'}"
         tabindex="42" [attr.title]="'title'" [hidden]="true">
    </div>
  `,
})
class TestComponent {
  @ViewChild('normal', { static: true }) normalChild!: ElementRef;

  constructor(private element: ElementRef) { }

  get hostElement(): HTMLElement {
    return this.element.nativeElement;
  }

  get childElement(): HTMLDivElement {
    return this.normalChild.nativeElement;
  }
}

@Component({
  selector: 'test-cmp',
  template: `
    <ng-host [class.foo]="true" [class.bar]="false"
             [style.color]="'red'"
             [attr.tabindex]="'42'"
             [hidden]="true">
    </ng-host>
  `,
})
class TestComponentWithHost {
  @HostBinding('class.foo') hostClassFoo = false;
  @HostBinding('class.bar') hostClassBar = true;
  @HostBinding('style.color') hostStyleColor = 'blue';
  @HostBinding('attr.tabindex') hostTabIndex = '84';
  @HostBinding('hidden') hostHidden = false;

  constructor(private element: ElementRef) { }

  get hostElement(): HTMLElement {
    return this.element.nativeElement;
  }
}
