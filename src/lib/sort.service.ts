import { Injectable } from '@angular/core';
import { DragUnitDirective as DragUnit } from './drag-unit.directive';
import { DragCollectionDirective as DragCollection } from './collection.directive';
import { Point, UnitPosition, CollectionSorted } from './interfaces';
import { reorderItems } from './utils';
import { createPoint } from './point';


@Injectable()
export class SortService {

	private _root: DragCollection;

	/** List of units with their positions on the screen */
	private _listOfPositions: Array<UnitPosition> | null;

	/** Old position (index) of the element in the array of the elements */
	private _from: number | null;

	/** Old position (index) of the element in the array of the elements */
	private _to: number | null;

	constructor() {
		this._listOfPositions = null;
		this._from = null;
		this._to = null;
	}

	private cachePosition(unit: DragUnit) {
		this._listOfPositions.push(this.getPosition(unit));
	}

	private findIndex(point: Point): number {

		for (const $ of this._listOfPositions) {

			const left = point.x > $.rect.left + $.shift.x;
			const right = point.x < $.rect.right + $.shift.x;
			const top = point.y > $.rect.top + $.shift.y;
			const bottom = point.y < $.rect.bottom + $.shift.y;

			if (left && right && top && bottom) {
				return this._listOfPositions.indexOf($);
			}
		}
		return -1;
	}

	private getPosition(unit: DragUnit) {
		return {
			unit,
			rect: unit.getRect(),
			shift: createPoint()
		} as UnitPosition;
	}

	public initService(container: DragCollection) {
		this._root = container;
	}

	public cacheAllPositions() {
		this._listOfPositions = new Array();
		this._root.units.forEach(unit => this.cachePosition(unit));
	}

	public moveUnits(unit: DragUnit, point: Point) {

		const elements = this._listOfPositions;

		const oldIndex = elements.map(i => i.unit).indexOf(unit);

		const newIndex = this.findIndex(point);

		if (oldIndex === -1 || newIndex === -1 || newIndex === oldIndex || this._from === null) {
			return;
		}

		this._to = newIndex;

		const newPosition: Point = {
			x: elements[newIndex].rect.left + elements[newIndex].shift.x,
			y: elements[newIndex].rect.top + elements[newIndex].shift.y
		};

		const step = newIndex > oldIndex ? -1 : 1;

		for (let current = newIndex; current !== oldIndex; current += step) {

			const next: number = current + step;

			const shift: Point = {
				x: (elements[next].rect.left + elements[next].shift.x) - (elements[current].rect.left + elements[current].shift.x),
				y: (elements[next].rect.top + elements[next].shift.y) - (elements[current].rect.top + elements[current].shift.y)
			};

			elements[current].shift.x += shift.x;
			elements[current].shift.y += shift.y;

			elements[current].unit.applyTransformation(elements[current].shift);
		}

		elements[oldIndex].shift.x = (newPosition.x - elements[oldIndex].rect.left);
		elements[oldIndex].shift.y = (newPosition.y - elements[oldIndex].rect.top);

		unit.setOffset(elements[oldIndex].shift);

		this._listOfPositions = elements;

		this._listOfPositions = reorderItems(this._listOfPositions, oldIndex, newIndex);
	}

	public start(units: DragUnit[], point: Point, from: number) {
		this.cacheAllPositions();
		this._from = from;
	}

	public stop(unit: DragUnit): Promise<CollectionSorted> {
		return new Promise((resolve) => {
			const $: CollectionSorted = {
				collection: this._root,
				unit,
				previousIndex: this._from,
				currentIndex: this._to
			};

			resolve($);

			this._listOfPositions = null;
			this._from = null;
			this._to = null;
		});
	}
}
