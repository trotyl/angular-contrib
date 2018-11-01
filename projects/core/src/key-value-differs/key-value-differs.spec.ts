import { KeyValueDiffer, KeyValueDiffers, KeyValueDifferFactory } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { KEY_VALUE_DIFFER_FACTORIES } from './key-value-differs';
import { ContribKeyValueDiffersModule } from './key-value-differs.module';

describe('KeyValueDiffers Extensibility', () => {
  let spyKeyValueDifferFactory: KeyValueDifferFactory;

  beforeEach(() => {
    spyKeyValueDifferFactory = {
      supports(value: any): boolean { return true; },
      create(): KeyValueDiffer<any, any> { return { value: 42 } as any; },
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ContribKeyValueDiffersModule],
      providers: [
        { provide: KEY_VALUE_DIFFER_FACTORIES, multi: true, useValue: spyKeyValueDifferFactory },
      ],
    }).compileComponents();
  }));

  it('should use custom KeyValueDifferFactory', inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
    const differ = differs.find([1, 2]).create();

    expect(differ).toEqual({ value: 42 } as any);
  }));

});
