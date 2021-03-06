import {
	Directive,
	Inject,
	SkipSelf,
	ElementRef,
	AfterViewInit,
	OnDestroy,
	Output,
	EventEmitter,
	NgZone,
	InjectionToken,
	ContentChildren,
	QueryList,
	Input
} from '@angular/core';
import { Point, UnitTaken, UnitReleased, UnitMoved } from './interfaces';
import { Subject, Subscription } from 'rxjs';
import { DragCollectionInterface as DragCollection } from './collection.directive';
import { EventService } from './event.service';
import { createPoint, pointFromPointerEvent, pointDif, pointSum } from './point';
import { first, takeUntil, tap } from 'rxjs/operators';
import { transitionTimeOf } from './transition';
import { DragHandleDirective } from './drag-handle.directive';
import { DragRejectorDirective } from './drag-rejector.directive';
import { DRAG_UNIT_PARENT } from './parent';

export const DRAG_COLLECTION = new InjectionToken<DragCollection>('Container');

@Directive({
	selector: '[dragUnit]',
	providers: [
		{ provide: DRAG_UNIT_PARENT, useExisting: DragUnitDirective }
	],
	host: {
		'[class.drag-unit]': 'true',
		'[class.active]': 'active',
		'[class.dropped]': 'dropped',
		'[class.disabled]': 'disabled'
	}
})
export class DragUnitDirective implements AfterViewInit, OnDestroy {

	@Input('disabled') private _disabled: boolean;

	/** Emits when the element is successfully touched */
	@Output() private unitTaken = new EventEmitter<UnitTaken>();

	/** Emits when the element is released */
	@Output() private unitReleased = new EventEmitter<UnitReleased>();

	/** Emits when the element is moved on the page */
	@Output() private unitMoved = new EventEmitter<UnitMoved>();

	@ContentChildren(DragHandleDirective, { descendants: true }) private _handles: QueryList<DragHandleDirective>;

	@ContentChildren(DragRejectorDirective, { descendants: true }) private _rejectors: QueryList<DragRejectorDirective>;

	// Indicate if the element is dragging or not
	private _active = false;

	// Indicate if the element is dropped
	private _droppped = false;

	/** Emits when the element is destroyed */
	private _destroy = new Subject<void>();

	/** Point on the page. Changes when the element is touched and contains coordinates of the event */
	private _origin: Point;

	/** Contains current offset from origin position */
	private _offset: Point;

	private _pointerPosition: Point;

	/** Current scroll value since drag sequence has been started */
	private _scrollOrigin: Point;

	private _scrollOffset: Point;

	private _moveSubscribtion: Subscription = Subscription.EMPTY;

	private _upSubscription: Subscription = Subscription.EMPTY;

	private _scrollSubscription: Subscription = Subscription.EMPTY;

	get active() {
		return this._active;
	}

	get dropped() {
		return this._droppped;
	}

	get disabled() {
		return this._disabled;
	}

	constructor(
		@Inject(DRAG_COLLECTION) @SkipSelf() public container: DragCollection,
		@SkipSelf() private eventService: EventService,
		private _host: ElementRef<HTMLElement>,
		private _zone: NgZone
	) {
		this._origin = this._offset = this._scrollOrigin = this._scrollOffset = createPoint();
	}

	ngAfterViewInit() {
		['mousedown', 'touchstart'].forEach((e: string) => {
			this._host.nativeElement.addEventListener(e, this._pointerDown.bind(this), { passive: false, capture: true });
		});
	}

	ngOnDestroy() {
		this._destroy.next();
		this._destroy.complete();
	}

	public applyTransformation(shift: Point) {
		if (shift.x === 0 && shift.y === 0) {
			this._host.nativeElement.style.transform = '';
			return;
		}
		this._host.nativeElement.style.transform = `translate(${shift.x}px, ${shift.y}px)`;
	}

	public getRect(): ClientRect {
		return this._host.nativeElement.getBoundingClientRect();
	}

	public reset() {
		this._host.nativeElement.style.transform = null;
		this._active = false;
		this._droppped = false;
		this._offset = this._origin = this._scrollOrigin = this._scrollOffset = this._pointerPosition = { x: 0, y: 0 };
	}

	public setOffset(point: Point) {
		this._offset = point;
	}

	private _animateDroppedElement() {
		return new Promise((resolve, reject) => {
			this._zone.onStable.asObservable().pipe(first()).subscribe(resolve);
		});
	}

	private _initDragSequence(event: MouseEvent | TouchEvent) {

		this.eventService.applyGlobalListeners(event);

		this._scrollOrigin = { x: document.defaultView.scrollX, y: document.defaultView.scrollY };

		this._moveSubscribtion = this.eventService.move
			.pipe(
				takeUntil(this._destroy),
				tap((e) => {
					this._zone.run(() => this._pointerMove(e));
				})
			).subscribe();
		this._upSubscription = this.eventService.up
			.pipe(
				takeUntil(this._destroy),
				tap((e) => {
					this._zone.run(() => this._pointerUp(e));
				})
			).subscribe();
		this._scrollSubscription = this.eventService.scroll
			.pipe(
				takeUntil(this._destroy),
				tap((e) => {
					this._zone.run(() => this._viewScroll());
				})
			).subscribe();

		return;
	}

	private _viewScroll() {
		const view = document.defaultView;
		const currentScroll = { x: view.scrollX, y: view.scrollY };
		this._scrollOffset = pointDif(currentScroll, this._scrollOrigin);
		const point = pointSum(this._pointerPosition, this._scrollOffset);
		this.applyTransformation(pointDif(point, this._origin));
	}

	private _startDragSequence(event: MouseEvent | TouchEvent) {

		if (this.container.disabled || this._disabled) return;
		event.stopPropagation();

		this._initDragSequence(event);

		this._origin = this._pointerPosition = pointFromPointerEvent(event);
		this._active = true;
		this.container.start(this, this._origin);

		this.unitTaken.emit({
			unit: this,
			event
		});
	}

	private _stopDragSequence() {
		this._moveSubscribtion.unsubscribe();
		this._upSubscription.unsubscribe();
		this._scrollSubscription.unsubscribe();

		const delay = transitionTimeOf(this._host.nativeElement, 'transform');
		setTimeout(() => {
			this.container.stop(this);
			this.eventService.removeGlobalListeners();
		}, delay * 1.5);
	}

	private _pointerDown(event: MouseEvent | TouchEvent) {

		if (this.container.inAction) return;

		const target = event.target as HTMLElement;

		if (this._rejectors.length && this._rejectors.find(rejector => rejector.is(target))) return;
		else if (this._handles.length && !this._handles.find(handle => handle.is(target))) return;
		else if (true) this._zone.run(() => this._startDragSequence(event));

		return;
	}

	private _pointerMove(event: MouseEvent | TouchEvent) {
		this._pointerPosition = pointFromPointerEvent(event);
		const point = pointSum(this._pointerPosition, this._scrollOffset);
		this.applyTransformation(pointDif(point, this._origin));
		this.container.moveUnitTo(this, point);
		this.unitMoved.emit({
			unit: this,
			distance: pointDif(point, this._origin),
			event
		});
	}

	private _pointerUp(event: MouseEvent | TouchEvent) {
		this._active = false;
		this.applyTransformation(this._offset);
		this._droppped = true;
		this._animateDroppedElement().then(this._stopDragSequence.bind(this));

		this.unitReleased.emit({
			unit: this,
			event
		});
	}

}
