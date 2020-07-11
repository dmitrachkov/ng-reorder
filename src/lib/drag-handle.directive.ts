import { Directive, SkipSelf, Inject, ElementRef } from '@angular/core';
import { DRAG_UNIT_PARENT } from './parent';
import { DragUnitDirective } from './drag-unit.directive';

@Directive({
  selector: '[dragHandle]'
})
export class DragHandleDirective {

  constructor(
    @Inject(DRAG_UNIT_PARENT) @SkipSelf() private _parent: any,
    private _host: ElementRef
  ) { }
  /** @returns true if the hanlde is equal to an element */
  is(element: HTMLElement): boolean {
    return this._host.nativeElement === element;
  }
}
