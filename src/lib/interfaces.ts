import { DragUnitDirective as DragUnit, DragUnitDirective } from './drag-unit.directive';
import { DragCollectionDirective } from './collection.directive';
/** Point on the page with x and y coordinates */
export interface Point {
    x: number;
    y: number;
}

/** Position of every unit */
export interface UnitPosition {
    /** Current element */
    unit: DragUnit;
    rect: ClientRect;
    shift: Point;
}

export interface UnitTaken {
    unit: DragUnit;
    event: MouseEvent | TouchEvent;
}

export interface UnitMoved {
    unit: DragUnit;
    distance: Point;
    event: MouseEvent | TouchEvent;
}

export interface UnitReleased {
    unit: DragUnit;
    event: MouseEvent | TouchEvent;
}

export interface CollectionSorted {
    collection: DragCollectionDirective;
    unit: DragUnitDirective;
    previousIndex: number;
    currentIndex: number;
}
