import { Directive, Inject, SkipSelf, ElementRef } from '@angular/core';
import { DRAG_UNIT_PARENT } from './parent';

@Directive({
  selector: '[dragRejector]'
})
export class DragRejectorDirective {

  constructor(
    @Inject(DRAG_UNIT_PARENT) @SkipSelf() private _parent: any,
    private _host: ElementRef
  ) { }
/** @returns true if the rejector is equal to an element */
  is(element: HTMLElement): boolean {
    return this._host.nativeElement === element;
  }

}
