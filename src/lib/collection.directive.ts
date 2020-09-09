import {
	Directive,
	ContentChildren,
	QueryList,
	AfterViewInit,
	EventEmitter,
	NgZone,
	Output,
	Host,
	HostBinding,
	Inject,
	Input,
} from '@angular/core';
import { DragUnitDirective as DragUnit, DRAG_COLLECTION } from './drag-unit.directive';
import { SortService } from './sort.service';
import { EventService } from './event.service';
import { Point, CollectionSorted } from './interfaces';
import { GLOBAL_CONFIG, Configuration } from './global-config';

export const DEFAULT_CONFIG = {
	collection_disabled: false,
	collection_class_primary: 'collection',
	collection_class_dragging: 'in-action',
	collection_class_disabled: 'disabled',
	unit_dragging_delay: 0,
	unit_disabled: false,
	unit_class_primary: 'drag-unit',
	unit_class_dragging: 'active',
	unit_class_disabled: 'disabled'
};

/** Exported an empty interface of DragCollectionDirective to prevent circular dependency */
export interface DragCollectionInterface extends DragCollectionDirective { }

@Directive({
	selector: '[dragCollection]',
	providers: [
		{ provide: GLOBAL_CONFIG, useValue: DEFAULT_CONFIG },
		{ provide: DRAG_COLLECTION, useExisting: DragCollectionDirective },
		EventService,
		SortService
	]
})
export class DragCollectionDirective implements AfterViewInit {

	@HostBinding('class')
	get classList(): string {
		const primary = this.class_primary ?? this.config.collection_class_primary;
		const dragging = this._inAction ? this.class_dragging ?? this.config.collection_class_dragging : false;
		const disabled = this._disabled ? this.class_disabled ?? this.config.collection_class_disabled : false;

		return [primary, dragging, disabled].filter(Boolean).join(' ');
	}

	@Input() private class_primary: string;

	@Input() private class_dragging: string;

	@Input() private class_disabled: string;

	@Input('disabled') private _disabled?: boolean;

	@Output() public dropCompleted: EventEmitter<CollectionSorted> = new EventEmitter();

	@ContentChildren(DragUnit) _units: QueryList<DragUnit>;

	private _inAction: boolean;

	private _activeItem: DragUnit | null;

	constructor(
		private _zone: NgZone,
		@Host() private sortService: SortService,
		@Host() private eventService: EventService,
		@Inject(GLOBAL_CONFIG) private config: Configuration,
	) {
		this._activeItem = null;
	}

	ngAfterViewInit() {
		this.sortService.initService(this);
	}

	private clearChildren() {
		this._zone.run(() => {
			this._units.toArray().forEach(unit => unit.reset());
		});
	}

	public isDisabled() {
		return this._disabled;
	}

	public moveUnitTo(unit: DragUnit, point: Point) {
		this.sortService.moveUnits(unit, point);
	}

	public start(unit: DragUnit, point: Point) {
		this._inAction = true;
		const units = this._units.toArray();
		const from = units.indexOf(unit);
		this.sortService.start(units, point, from);
		this._activeItem = unit;
	}

	public stop(unit: DragUnit) {
		this._inAction = false;
		this.clearChildren();
		this.sortService.stop(unit);

		this._activeItem = null;
	}

	public hasDragSequence() {
		return this._activeItem !== null;
	}

}
