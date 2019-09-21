import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Styling } from './styling';

describe('Styling', () => {
  let service: Styling;

  beforeEach(() => {
    service = TestBed.get(Styling);
  });

  it('should add global style', () => {
    const document: Document = TestBed.get(DOCUMENT);
    const previousLength = document.head.childNodes.length;

    const dispose = service.addGlobalStyle('body { color: red; }');

    const length = document.head.childNodes.length;
    expect(length).toBe(previousLength + 1);

    const lastChild = document.head.childNodes[length - 1];
    expect(lastChild instanceof HTMLStyleElement).toBe(true);

    dispose();

    const postDisposeLength = document.head.childNodes.length;
    expect(postDisposeLength).toBe(previousLength);
  });
});
