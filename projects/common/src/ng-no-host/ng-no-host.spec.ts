import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContribNgNoHostModule } from './ng-no-host.module';

// TODO: add more tests
describe('ngNoHost', () => {
  describe('in static attribute', () => {
    @Component({
      template: `
        Begin
        <div ngNoHost>Foo</div>
        End
      `,
    })
    class TestComponent {}

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [CommonModule, ContribNgNoHostModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
    });

    it('should respond to ngNoHost attribute', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).not.toContain(`<div>`);
      expect(fixture.nativeElement.innerHTML).toContain(`<!--ngNoHostStart-->Foo<!--ngNoHostEnd-->`);
      expect(fixture.nativeElement.textContent.trim()).toBe(`Begin Foo End`);
    });
  });

  describe('in dynamic attribute', () => {
    @Component({
      template: `
        Begin
        <div [attr.ngNoHost]="noHost">Foo</div>
        End
      `,
    })
    class TestComponent {
      noHost: string | null = '';
    }

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [CommonModule, ContribNgNoHostModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
    });

    it('should respond to ngNoHost attribute', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).not.toContain(`<div>`);
      expect(fixture.nativeElement.innerHTML).toContain(`<!--ngNoHostStart-->Foo<!--ngNoHostEnd-->`);
      expect(fixture.nativeElement.textContent.trim()).toBe(`Begin Foo End`);

      component.noHost = null;
      fixture.detectChanges();

      expect(fixture.nativeElement.innerHTML).toContain(`<div>Foo</div>`);
      expect(fixture.nativeElement.textContent.trim()).toBe(`Begin Foo End`);
    });
  });

  describe('in embedded view', () => {
    @Component({
      template: `
        Begin
        <div *ngIf="showContent" ngNoHost>Foo</div>
        End
      `,
    })
    class TestComponent {
      showContent: boolean = true;
    }

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [CommonModule, ContribNgNoHostModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
    });

    it('should respond to ngNoHost attribute', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).not.toContain(`<div>`);
      expect(fixture.nativeElement.innerHTML).toContain(`<!--ngNoHostStart-->Foo<!--ngNoHostEnd-->`);
      expect(fixture.nativeElement.textContent.trim()).toBe(`Begin Foo End`);

      component.showContent = false;
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(`Begin  End`);
    });
  });

  describe('in component host', () => {
    @Component({
      selector: 'test-no-host',
      template: `Hello {{ name }} and <ng-content></ng-content>!`,
    })
    class NoHostComponent {
      @Input() @HostBinding('attr.ngNoHost') noHost = '';
      name = 'World';
    }

    @Component({
      template: `
        Begin
        <test-no-host [noHost]="noHost">Universe</test-no-host>
        End
      `,
    })
    class TestComponent {
      noHost: string | null = '';
    }

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, NoHostComponent],
        imports: [CommonModule, ContribNgNoHostModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
    });

    it('should respond to ngNoHost attribute', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).not.toContain(`<test-no-host>`);
      expect(fixture.nativeElement.innerHTML).toContain(`<!--ngNoHostStart-->Hello World and Universe!<!--ngNoHostEnd-->`);
      expect(fixture.nativeElement.textContent.trim()).toBe(`Begin Hello World and Universe! End`);

      component.noHost = null;
      fixture.detectChanges();

      expect(fixture.nativeElement.innerHTML).toContain(`<test-no-host>Hello World and Universe!</test-no-host>`);
      expect(fixture.nativeElement.textContent.trim()).toBe(`Begin Hello World and Universe! End`);
    });
  });
});
