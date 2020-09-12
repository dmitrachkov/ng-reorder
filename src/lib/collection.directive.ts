import {
	Directive,
	ContentChildren,
	QueryList,
	AfterViewInit,
	EventEmitter,
	NgZone,
	Output,
	Input,
	Self,
} from '@angular/core';
import { DragUnitDirective as DragUnit, DRAG_COLLECTION } from './drag-unit.directive';
import { SortService } from './sort.service';
import { EventService } from './event.service';
import { Point, CollectionSorted } from './interfaces';

/** Exported an empty interface of DragCollectionDirective to prevent circular dependency */
export interface DragCollectionInterface extends DragCollectionDirective { }

@Directive({
	selector: '[dragCollection]',
	providers: [
		{ provide: DRAG_COLLECTION, useExisting: DragCollectionDirective },
		EventService,
		SortService
	],
	host: {
		'[class.collection]': 'true',
		'[class.in-action]': 'inAction',
		'[class.disabled]': 'disabled'
	}
})
export class DragCollectionDirective implements AfterViewInit {

	@Input('disabled') private _disabled?: boolean;

	@Output() private dropCompleted: EventEmitter<CollectionSorted> = new EventEmitter();

	@ContentChildren(DragUnit) units: QueryList<DragUnit>;

	private _activeItem: DragUnit | null;

	get inAction() {
		return this._activeItem !== null;
	}

	get disabled() {
		return this._disabled;
	}

	constructor(
		private _zone: NgZone,
		@Self() private sortService: SortService,
	) {
		this._activeItem = null;
	}

	ngAfterViewInit() {
		this.sortService.initService(this);
	}

	private clearChildren() {
		this._zone.run(() => {
			this.units.toArray().forEach(unit => unit.reset());
		});
	}

	public moveUnitTo(unit: DragUnit, point: Point) {
		this.sortService.moveUnits(unit, point);
	}

	public start(unit: DragUnit, point: Point) {
		const units = this.units.toArray();
		const from = units.indexOf(unit);
		this.sortService.start(units, point, from);
		this._activeItem = unit;
	}

	public stop(unit: DragUnit) {
		this.clearChildren();
		this.sortService.stop(unit).then((e) => {
			if (e.currentIndex !== null) this.dropCompleted.emit(e);
		});
		this._activeItem = null;
	}
}
