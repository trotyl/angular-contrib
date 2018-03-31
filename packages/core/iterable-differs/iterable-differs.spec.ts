import { IterableDiffer, IterableDiffers, IterableDifferFactory } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { ITERABLE_DIFFER_FACTORIES } from './iterable-differs';
import { IterableDiffersModule } from './iterable-differs.module';

describe('IterableDiffers Extensibility', () => {
  let spyIterableDifferFactory: IterableDifferFactory;

  beforeEach(() => {
    spyIterableDifferFactory = {
      supports(value: any): boolean { return true; },
      create(): IterableDiffer<any> { return { value: 42 } as any; },
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IterableDiffersModule],
      providers: [
        { provide: ITERABLE_DIFFER_FACTORIES, multi: true, useValue: spyIterableDifferFactory },
      ],
    }).compileComponents();
  }));

  it('should use custom IterableDifferFactory', inject([IterableDiffers], (differs: IterableDiffers) => {
    const differ = differs.find([1, 2]).create();

    expect(differ).toEqual({ value: 42 } as any);
  }));

});
