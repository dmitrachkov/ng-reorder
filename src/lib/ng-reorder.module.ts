import { NgModule } from '@angular/core';
import { DragCollectionDirective } from './collection.directive';
import { DragUnitDirective } from './drag-unit.directive';
import { DragHandleDirective } from './drag-handle.directive';
import { DragRejectorDirective } from './drag-rejector.directive';


@NgModule({
	declarations: [
		DragCollectionDirective,
		DragUnitDirective,
		DragHandleDirective,
		DragRejectorDirective,
	],
	imports: [
	],
	exports: [DragCollectionDirective, DragUnitDirective, DragHandleDirective, DragRejectorDirective]
})
export class NgReorderModule { }
